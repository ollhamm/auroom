"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Info,
  CheckCircle as CheckCircleIcon,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  usePosition,
  useXautPrice,
  useTotalDebt,
  useIdrxBalance,
  useIdrxAllowance,
  useApproveIdrx,
  useRepay,
} from "@/app/hooks/useProtocol";
import {
  formatXaut,
  formatIdrx,
  formatPriceRaw,
} from "@/app/lib/format";
import { PROTOCOL_CONFIG, CHAIN_CONFIG } from "@/app/contracts";

export default function RepayPage() {
  const [repayAmount, setRepayAmount] = useState("");
  const { address, isConnected } = useAccount();

  // Read data
  const { data: position, refetch: refetchPosition } = usePosition(address);
  const { data: price } = useXautPrice();
  const { data: totalDebtData, refetch: refetchDebt } = useTotalDebt(address);
  const { data: idrxBalance, refetch: refetchBalance } = useIdrxBalance(address);
  const { data: allowance, refetch: refetchAllowance } = useIdrxAllowance(address);

  // Write operations
  const {
    approve,
    isPending: approving,
    isConfirming: approvingConfirm,
    isSuccess: approved,
    reset: resetApprove,
  } = useApproveIdrx();

  const {
    repay,
    isPending: repaying,
    isConfirming: repayConfirming,
    isSuccess: repaid,
    hash: repayHash,
    reset: resetRepay,
  } = useRepay();

  // Derived values
  const collateralAmount = position?.collateralAmount || 0n;
  const totalDebt = totalDebtData || 0n;
  const priceUsd = price ? formatPriceRaw(price) : 0;
  const balance = idrxBalance || 0n;

  const repayValue = BigInt(Math.floor(Number(repayAmount || 0) * 100)); // IDRX has 2 decimals
  const needsApproval = allowance !== undefined && repayValue > allowance;
  const maxRepayable = totalDebt < balance ? totalDebt : balance;

  // Calculate new LTV after repay
  const calculateNewLTV = () => {
    if (collateralAmount === 0n || !price) return 0;
    const remainingDebt = totalDebt > repayValue ? totalDebt - repayValue : 0n;
    const collateralValueUsd = Number(formatXaut(collateralAmount)) * priceUsd;
    const debtValueUsd = Number(formatIdrx(remainingDebt)) / 16000;
    if (collateralValueUsd === 0) return 0;
    return (debtValueUsd / collateralValueUsd) * 100;
  };

  const currentLTV = () => {
    if (collateralAmount === 0n || !price) return 0;
    const collateralValueUsd = Number(formatXaut(collateralAmount)) * priceUsd;
    const debtValueUsd = Number(formatIdrx(totalDebt)) / 16000;
    if (collateralValueUsd === 0) return 0;
    return (debtValueUsd / collateralValueUsd) * 100;
  };

  const newLTV = calculateNewLTV();
  const oldLTV = currentLTV();
  const maxLTVPercent = PROTOCOL_CONFIG.LTV_BPS / 100;
  const liquidationThreshold = PROTOCOL_CONFIG.LIQUIDATION_THRESHOLD_BPS / 100;
  const interestRate = PROTOCOL_CONFIG.ANNUAL_INTEREST_RATE_BPS / 100;

  const newHealthFactor = newLTV > 0 ? liquidationThreshold / newLTV : Infinity;
  const isFullPayoff = repayValue >= totalDebt;

  const canRepay =
    isConnected &&
    Number(repayAmount) > 0 &&
    repayValue <= balance &&
    totalDebt > 0n;

  // Refetch after successful repay
  useEffect(() => {
    if (repaid) {
      refetchPosition();
      refetchDebt();
      refetchBalance();
      refetchAllowance();
      setTimeout(() => {
        setRepayAmount("");
        resetRepay();
        resetApprove();
      }, 3000);
    }
  }, [repaid]);

  useEffect(() => {
    if (approved) {
      refetchAllowance();
    }
  }, [approved]);

  const handleMaxClick = () => {
    setRepayAmount(formatIdrx(maxRepayable).replace(/,/g, ""));
  };

  const handlePercentageClick = (percentage: number) => {
    const amount = (Number(formatIdrx(totalDebt).replace(/,/g, "")) * percentage) / 100;
    const capped = Math.min(amount, Number(formatIdrx(balance).replace(/,/g, "")));
    setRepayAmount(capped.toFixed(0));
  };

  const handleSubmit = () => {
    if (needsApproval) {
      approve(repayAmount);
    } else {
      repay(repayAmount);
    }
  };

  const isLoading = approving || approvingConfirm || repaying || repayConfirming;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-18">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Repay IDRX
        </h1>
        <p className="text-text-secondary">
          Reduce your debt and improve your position health
        </p>
      </div>

      <div className="bg-gradient-to-b from-bg-main to-white shadow-xl rounded-tl-[4rem] rounded-3xl p-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Connect Your Wallet
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Please connect your wallet to repay your loans.
            </p>
          </div>
        ) : totalDebt === 0n ? (
          /* No Debt State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              No Outstanding Debt
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              You have no active loans. Your collateral is fully available for withdrawal.
            </p>
            <Link
              href="/app/withdraw"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl inline-block"
            >
              Withdraw Collateral
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Repay Form */}
            <div className="lg:col-span-2">
              <div className="bg-primary/5 rounded-3xl p-8 shadow-md">
                <h2 className="text-xl font-bold text-text-primary mb-6">
                  Repayment Amount
                </h2>

                {/* Current Debt */}
                <div className="mb-6 p-4 bg-white/60 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-text-primary">
                      Total Outstanding Debt
                    </span>
                    <span className="text-lg font-bold text-text-primary">
                      {formatIdrx(totalDebt)} IDRX
                    </span>
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="flex items-center justify-between mb-4 p-4 bg-white/60 rounded-2xl">
                  <span className="text-sm text-text-secondary">
                    Your IDRX Balance
                  </span>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-text-secondary" />
                    <span className="font-semibold text-text-primary">
                      {formatIdrx(balance)} IDRX
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handlePercentageClick(pct)}
                      disabled={isLoading}
                      className="px-4 py-3 bg-white hover:bg-primary/10 border-2 border-gray-200 hover:border-primary text-text-primary font-semibold rounded-2xl transition-all disabled:opacity-50"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      placeholder="0"
                      disabled={isLoading}
                      className="w-full text-4xl font-bold text-text-primary bg-white rounded-3xl px-6 py-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <button
                        onClick={handleMaxClick}
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm rounded-full transition-all disabled:opacity-50"
                      >
                        MAX
                      </button>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                        <span className="font-semibold text-text-primary">
                          IDRX
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 px-6">
                    <span className="text-sm text-text-secondary">
                      ≈ ${(Number(repayAmount || 0) / 16000).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD
                    </span>
                  </div>
                </div>

                {/* LTV Progress After Repayment */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      LTV After Repayment
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-secondary line-through">
                        {oldLTV.toFixed(1)}%
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {newLTV.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        newLTV === 0
                          ? "bg-primary"
                          : newLTV < 30
                            ? "bg-primary"
                            : newLTV < 50
                              ? "bg-secondary"
                              : "bg-error"
                      }`}
                      style={{ width: `${Math.min((newLTV / maxLTVPercent) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Full Payoff Notice */}
                {isFullPayoff && Number(repayAmount) > 0 && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">
                        Full Loan Payoff
                      </p>
                      <p className="text-xs text-text-secondary">
                        This will fully repay your loan. Your collateral will be
                        available for withdrawal.
                      </p>
                    </div>
                  </div>
                )}

                {/* Transaction Status */}
                {repayHash && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-2xl">
                    {repayConfirming && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming repayment...</span>
                      </div>
                    )}
                    {repaid && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Repayment successful!</span>
                        <a
                          href={`${CHAIN_CONFIG.blockExplorer}/tx/${repayHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          View tx
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!canRepay || isLoading || repaid}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : repaid ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                  {approving
                    ? "Approving..."
                    : approvingConfirm
                    ? "Confirming Approval..."
                    : repaying
                    ? "Repaying..."
                    : repayConfirming
                    ? "Confirming..."
                    : repaid
                    ? "Repayment Complete!"
                    : needsApproval
                    ? "Approve & Repay"
                    : `Repay ${Number(repayAmount) > 0 ? Number(repayAmount).toLocaleString() : ""} IDRX`}
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-bg-white to-primary/30 rounded-3xl p-6 shadow-md sticky top-8">
                <h3 className="text-lg font-bold text-text-primary mb-6">
                  Position Summary
                </h3>

                <div className="space-y-4">
                  {/* Collateral */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Collateral
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-text-primary">
                        {formatXaut(collateralAmount)}
                      </p>
                      <span className="text-sm text-text-secondary">XAUT</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      ≈ ${(Number(formatXaut(collateralAmount)) * priceUsd).toLocaleString()} USD
                    </p>
                  </div>

                  {/* Remaining Debt */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Remaining Debt
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">
                        {formatIdrx(totalDebt > repayValue ? totalDebt - repayValue : 0n)}
                      </p>
                      <span className="text-sm text-text-secondary">IDRX</span>
                    </div>
                    {Number(repayAmount) > 0 && (
                      <p className="text-xs text-primary mt-1">
                        -{Number(repayAmount).toLocaleString()} IDRX
                      </p>
                    )}
                  </div>

                  {/* Health Factor */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Health Factor (After)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-2xl font-bold ${
                          newHealthFactor === Infinity
                            ? "text-primary"
                            : newHealthFactor >= 1.5
                              ? "text-primary"
                              : newHealthFactor >= 1.2
                                ? "text-secondary"
                                : "text-error"
                        }`}
                      >
                        {newHealthFactor === Infinity ? "∞" : newHealthFactor.toFixed(2)}
                      </p>
                      {Number(repayAmount) > 0 && (
                        <TrendingUp className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>

                  {/* Interest Info */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-xs font-semibold text-text-primary mb-2">
                      Interest Saved
                    </p>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <p>• APR: {interestRate}%</p>
                      <p>
                        • Est. savings: ~{((Number(repayAmount || 0) * interestRate) / 100).toLocaleString()} IDRX/year
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info Section */}
        {totalDebt > 0n && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">No Penalties</h4>
              </div>
              <p className="text-sm text-text-secondary">
                Repay anytime without penalties. Partial or full repayments are always welcome.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">Improve Health</h4>
              </div>
              <p className="text-sm text-text-secondary">
                Every repayment improves your health factor and reduces liquidation risk.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">Unlock Collateral</h4>
              </div>
              <p className="text-sm text-text-secondary">
                Full repayment unlocks your collateral for withdrawal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
