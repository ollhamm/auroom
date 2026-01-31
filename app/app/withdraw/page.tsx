"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  Coins,
  TrendingDown,
  Info,
  AlertTriangle,
  ArrowRight,
  CheckCircle as CheckCircleIcon,
  Loader2,
} from "lucide-react";
import {
  usePosition,
  useXautPrice,
  useTotalDebt,
  useWithdraw,
} from "@/app/hooks/useProtocol";
import {
  formatXaut,
  formatIdrx,
  formatPriceRaw,
  calculateWithdrawableCollateral,
} from "@/app/lib/format";
import { PROTOCOL_CONFIG, CHAIN_CONFIG } from "@/app/contracts";

export default function WithdrawPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { address, isConnected } = useAccount();

  // Read data
  const { data: position, refetch: refetchPosition } = usePosition(address);
  const { data: price } = useXautPrice();
  const { data: totalDebtData, refetch: refetchDebt } = useTotalDebt(address);

  // Write operations
  const {
    withdraw,
    isPending: withdrawing,
    isConfirming: withdrawConfirming,
    isSuccess: withdrawn,
    hash: withdrawHash,
    reset: resetWithdraw,
  } = useWithdraw();

  // Derived values
  const collateralAmount = position?.collateralAmount || 0n;
  const totalDebt = totalDebtData || 0n;
  const priceUsd = price ? formatPriceRaw(price) : 0;
  const maxWithdrawable = price
    ? calculateWithdrawableCollateral(collateralAmount, totalDebt, price)
    : 0n;

  const withdrawValue = BigInt(Math.floor(Number(withdrawAmount || 0) * 1e18)); // XAUT has 18 decimals
  const newCollateral = collateralAmount > withdrawValue ? collateralAmount - withdrawValue : 0n;

  // Calculate new LTV after withdrawal
  const calculateNewLTV = () => {
    if (totalDebt === 0n || !price) return 0;
    if (newCollateral === 0n) return Infinity;
    const collateralValueUsd = Number(formatXaut(newCollateral)) * priceUsd;
    const debtValueUsd = Number(formatIdrx(totalDebt)) / 16000;
    if (collateralValueUsd === 0) return Infinity;
    return (debtValueUsd / collateralValueUsd) * 100;
  };

  const currentLTV = () => {
    if (totalDebt === 0n || !price) return 0;
    const collateralValueUsd = Number(formatXaut(collateralAmount)) * priceUsd;
    const debtValueUsd = Number(formatIdrx(totalDebt)) / 16000;
    if (collateralValueUsd === 0) return 0;
    return (debtValueUsd / collateralValueUsd) * 100;
  };

  const newLTV = calculateNewLTV();
  const oldLTV = currentLTV();
  const maxLTVPercent = PROTOCOL_CONFIG.LTV_BPS / 100;
  const liquidationThreshold = PROTOCOL_CONFIG.LIQUIDATION_THRESHOLD_BPS / 100;

  const newHealthFactor = newLTV > 0 && newLTV !== Infinity ? liquidationThreshold / newLTV : Infinity;
  const isNearMaxLTV = newLTV > maxLTVPercent * 0.9 && newLTV !== Infinity;
  const isExceedingMaxLTV = newLTV > maxLTVPercent || newLTV === Infinity;

  const canWithdraw =
    isConnected &&
    Number(withdrawAmount) > 0 &&
    withdrawValue <= maxWithdrawable &&
    collateralAmount > 0n;

  // Refetch after successful withdrawal
  useEffect(() => {
    if (withdrawn) {
      refetchPosition();
      refetchDebt();
      setTimeout(() => {
        setWithdrawAmount("");
        resetWithdraw();
      }, 3000);
    }
  }, [withdrawn]);

  const handleMaxClick = () => {
    setWithdrawAmount(formatXaut(maxWithdrawable));
  };

  const handlePercentageClick = (percentage: number) => {
    const amount = (Number(formatXaut(maxWithdrawable)) * percentage) / 100;
    setWithdrawAmount(amount.toFixed(4));
  };

  const isLoading = withdrawing || withdrawConfirming;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-18">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Withdraw XAUT
        </h1>
        <p className="text-text-secondary">
          Take back your gold collateral while maintaining healthy position
        </p>
      </div>

      <div className="bg-gradient-to-b from-bg-main to-white shadow-xl rounded-tl-[4rem] rounded-3xl p-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coins className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Connect Your Wallet
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Please connect your wallet to withdraw collateral.
            </p>
          </div>
        ) : collateralAmount === 0n ? (
          /* No Collateral State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coins className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              No Collateral Available
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              You don't have any XAUT deposited. Deposit collateral first.
            </p>
            <Link
              href="/app/deposit"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl inline-block"
            >
              Deposit Collateral
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Withdraw Form */}
            <div className="lg:col-span-2">
              <div className="bg-primary/5 rounded-3xl p-8 shadow-md">
                <h2 className="text-xl font-bold text-text-primary mb-6">
                  Withdrawal Amount
                </h2>

                {/* Current Position */}
                <div className="mb-6 p-4 bg-white/60 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-text-primary">
                      Total Deposited Collateral
                    </span>
                    <span className="text-lg font-bold text-text-primary">
                      {formatXaut(collateralAmount)} XAUT
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-text-secondary">Value</span>
                    <span className="text-sm font-medium text-text-primary">
                      ≈ ${(Number(formatXaut(collateralAmount)) * priceUsd).toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {/* Available to Withdraw */}
                <div className="flex items-center justify-between mb-4 p-4 bg-white/60 rounded-2xl">
                  <span className="text-sm text-text-secondary">
                    Available to Withdraw
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      {formatXaut(maxWithdrawable)} XAUT
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                {totalDebt > 0n && (
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
                )}

                {/* Input Field */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0"
                      step="0.0001"
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
                          XAUT
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 px-6">
                    <span className="text-sm text-text-secondary">
                      ≈ ${(Number(withdrawAmount || 0) * priceUsd).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD
                    </span>
                  </div>
                </div>

                {/* LTV Progress After Withdrawal */}
                {totalDebt > 0n && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        LTV After Withdrawal
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-text-secondary line-through">
                          {oldLTV.toFixed(1)}%
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            isExceedingMaxLTV
                              ? "text-error"
                              : isNearMaxLTV
                                ? "text-secondary"
                                : "text-text-primary"
                          }`}
                        >
                          {newLTV === Infinity ? "∞" : newLTV.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          newLTV === 0
                            ? "bg-primary"
                            : newLTV < maxLTVPercent * 0.7
                              ? "bg-primary"
                              : newLTV < maxLTVPercent * 0.9
                                ? "bg-secondary"
                                : "bg-error"
                        }`}
                        style={{
                          width: `${Math.min((newLTV / maxLTVPercent) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Warning if approaching max LTV */}
                {isNearMaxLTV && Number(withdrawAmount) > 0 && !isExceedingMaxLTV && (
                  <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-secondary mb-1">
                        Approaching Max LTV
                      </p>
                      <p className="text-xs text-text-secondary">
                        Consider withdrawing less to maintain a safer position.
                      </p>
                    </div>
                  </div>
                )}

                {/* Full Withdrawal Notice */}
                {totalDebt === 0n && Number(withdrawAmount) > 0 && withdrawValue >= collateralAmount && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">
                        Full Collateral Withdrawal
                      </p>
                      <p className="text-xs text-text-secondary">
                        You're withdrawing all your collateral.
                      </p>
                    </div>
                  </div>
                )}

                {/* Transaction Status */}
                {withdrawHash && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-2xl">
                    {withdrawConfirming && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming withdrawal...</span>
                      </div>
                    )}
                    {withdrawn && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Withdrawal successful!</span>
                        <a
                          href={`${CHAIN_CONFIG.blockExplorer}/tx/${withdrawHash}`}
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
                  onClick={() => withdraw(withdrawAmount)}
                  disabled={!canWithdraw || isLoading || withdrawn}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : withdrawn ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                  {withdrawing
                    ? "Withdrawing..."
                    : withdrawConfirming
                    ? "Confirming..."
                    : withdrawn
                    ? "Withdrawal Complete!"
                    : `Withdraw ${Number(withdrawAmount) > 0 ? Number(withdrawAmount).toFixed(4) : ""} XAUT`}
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-bg-white to-primary/30 rounded-3xl p-6 shadow-md sticky top-8">
                <h3 className="text-lg font-bold text-text-primary mb-6">
                  After Withdrawal
                </h3>

                <div className="space-y-4">
                  {/* Remaining Collateral */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Remaining Collateral
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-text-primary">
                        {formatXaut(newCollateral)}
                      </p>
                      <span className="text-sm text-text-secondary">XAUT</span>
                    </div>
                    {Number(withdrawAmount) > 0 && (
                      <p className="text-xs text-error mt-1">
                        -{Number(withdrawAmount).toFixed(4)} XAUT
                      </p>
                    )}
                  </div>

                  {/* Total Debt */}
                  {totalDebt > 0n && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                      <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                        Total Debt
                      </span>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-primary">
                          {formatIdrx(totalDebt)}
                        </p>
                        <span className="text-sm text-text-secondary">IDRX</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">Unchanged</p>
                    </div>
                  )}

                  {/* Health Factor */}
                  {totalDebt > 0n && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                      <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                        Health Factor (After)
                      </span>
                      <div className="flex items-baseline gap-2">
                        <p
                          className={`text-2xl font-bold ${
                            newHealthFactor >= 1.5
                              ? "text-primary"
                              : newHealthFactor >= 1.2
                                ? "text-secondary"
                                : "text-error"
                          }`}
                        >
                          {newHealthFactor === Infinity ? "∞" : newHealthFactor.toFixed(2)}
                        </p>
                        {Number(withdrawAmount) > 0 && newHealthFactor < Infinity && (
                          <TrendingDown className="w-5 h-5 text-error" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* You Will Receive */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-xs font-semibold text-text-primary mb-2">
                      You Will Receive
                    </p>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <p>• {Number(withdrawAmount || 0).toFixed(4)} XAUT</p>
                      <p>• ≈ ${(Number(withdrawAmount || 0) * priceUsd).toLocaleString()} USD</p>
                      <p>• Direct to wallet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info Section */}
        {collateralAmount > 0n && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">Your Control</h4>
              </div>
              <p className="text-sm text-text-secondary">
                Withdraw your XAUT anytime. Your gold remains under your full control.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">Safe Limits</h4>
              </div>
              <p className="text-sm text-text-secondary">
                System ensures healthy position and prevents risky withdrawals.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">Instant</h4>
              </div>
              <p className="text-sm text-text-secondary">
                Withdrawals processed immediately on-chain to your wallet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
