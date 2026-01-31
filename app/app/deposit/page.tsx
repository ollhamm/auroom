"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Coins, TrendingUp, Info, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  useXautBalance,
  useXautAllowance,
  usePosition,
  useXautPrice,
  useApproveXaut,
  useDeposit,
} from "@/app/hooks/useProtocol";
import {
  formatXaut,
  formatPriceRaw,
  parseXaut,
  calculateMaxBorrow,
  formatIdrx,
} from "@/app/lib/format";
import { PROTOCOL_CONFIG, CHAIN_CONFIG } from "@/app/contracts";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();

  // Read data
  const { data: balance, refetch: refetchBalance } = useXautBalance(address);
  const { data: allowance, refetch: refetchAllowance } = useXautAllowance(address);
  const { data: position, refetch: refetchPosition } = usePosition(address);
  const { data: price } = useXautPrice();

  // Write operations
  const {
    approve,
    isPending: approving,
    isConfirming: approvingConfirm,
    isSuccess: approved,
    hash: approveHash,
    reset: resetApprove,
  } = useApproveXaut();
  const {
    deposit,
    isPending: depositing,
    isConfirming: depositingConfirm,
    isSuccess: deposited,
    hash: depositHash,
    reset: resetDeposit,
  } = useDeposit();

  // Derived values
  const amountWei = parseXaut(amount);
  const needsApproval = allowance !== undefined && amountWei > allowance;
  const hasBalance = balance !== undefined && amountWei <= balance;
  const canDeposit = amount && Number(amount) > 0 && hasBalance && isConnected;

  // Calculate values
  const priceUsd = price ? formatPriceRaw(price) : 0;
  const currentCollateral = position?.collateralAmount || 0n;
  const newCollateral = currentCollateral + amountWei;
  const maxBorrow = price ? calculateMaxBorrow(newCollateral, price) : 0n;

  // Refetch after successful deposit
  useEffect(() => {
    if (deposited) {
      refetchBalance();
      refetchAllowance();
      refetchPosition();
      // Reset after 3 seconds
      setTimeout(() => {
        setAmount("");
        resetDeposit();
        resetApprove();
      }, 3000);
    }
  }, [deposited]);

  // Auto-deposit after approval confirmed
  useEffect(() => {
    if (approved && allowance !== undefined) {
      refetchAllowance();
    }
  }, [approved]);

  const handleSubmit = () => {
    if (needsApproval) {
      approve(amount);
    } else {
      deposit(amount);
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      setAmount(formatXaut(balance));
    }
  };

  const isLoading = approving || approvingConfirm || depositing || depositingConfirm;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-18">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Deposit Collateral
        </h1>
        <p className="text-text-secondary">
          Deposit XAUT to unlock borrowing capacity
        </p>
      </div>

      <div className="bg-gradient-to-b from-bg-main to-white shadow-xl rounded-tl-[4rem] rounded-3xl p-8">
        {!isConnected ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-text-secondary">
              Please connect your wallet to deposit collateral
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Deposit Form */}
            <div className="lg:col-span-2">
              <div className="bg-primary/5 rounded-3xl p-8 shadow-md">
                <h2 className="text-xl font-bold text-text-primary mb-6">
                  Deposit Amount
                </h2>

                {/* Balance Display */}
                <div className="flex items-center justify-between mb-4 p-4 bg-white/60 rounded-2xl">
                  <span className="text-sm text-text-secondary">
                    Available Balance
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">
                      {formatXaut(balance)} XAUT
                    </span>
                  </div>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
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
                      ≈ ${(Number(amount || 0) * priceUsd).toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {/* Transaction Status */}
                {(approveHash || depositHash) && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-2xl">
                    {approvingConfirm && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming approval...</span>
                      </div>
                    )}
                    {approved && !deposited && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Approved! Now depositing...</span>
                      </div>
                    )}
                    {depositingConfirm && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming deposit...</span>
                      </div>
                    )}
                    {deposited && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Deposit successful!</span>
                        <a
                          href={`${CHAIN_CONFIG.blockExplorer}/tx/${depositHash}`}
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
                <div className="space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!canDeposit || isLoading || deposited}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : deposited ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                    {approving
                      ? "Approving..."
                      : approvingConfirm
                      ? "Confirming Approval..."
                      : depositing
                      ? "Depositing..."
                      : depositingConfirm
                      ? "Confirming Deposit..."
                      : deposited
                      ? "Deposit Complete!"
                      : needsApproval
                      ? "Approve & Deposit"
                      : "Deposit XAUT"}
                  </button>

                  {!hasBalance && amount && Number(amount) > 0 && (
                    <p className="text-center text-sm text-red-500">
                      Insufficient XAUT balance
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-bg-white to-primary/30 rounded-3xl p-6 shadow-md sticky top-8">
                <h3 className="text-lg font-bold text-text-primary mb-6">
                  After Deposit
                </h3>

                <div className="space-y-4">
                  {/* Current Collateral */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-text-secondary uppercase tracking-wide">
                        Total Collateral
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-text-primary">
                        {formatXaut(newCollateral)}
                      </p>
                      <span className="text-sm text-text-secondary">XAUT</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      ≈ ${(Number(formatXaut(newCollateral)) * priceUsd).toLocaleString()} USD
                    </p>
                  </div>

                  {/* Borrowing Capacity */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-text-secondary uppercase tracking-wide">
                        Borrowing Capacity
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">
                        {formatIdrx(maxBorrow)}
                      </p>
                      <span className="text-sm text-text-secondary">IDRX</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      At {PROTOCOL_CONFIG.LTV_BPS / 100}% LTV
                    </p>
                  </div>

                  {/* Protocol Info */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-xs font-semibold text-text-primary mb-2">
                      Protocol Info
                    </p>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <p>• Max LTV: {PROTOCOL_CONFIG.LTV_BPS / 100}%</p>
                      <p>• Liquidation: {PROTOCOL_CONFIG.LIQUIDATION_THRESHOLD_BPS / 100}%</p>
                      <p>• Interest: {PROTOCOL_CONFIG.ANNUAL_INTEREST_RATE_BPS / 100}% APR</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/60 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary">What is XAUT?</h4>
            </div>
            <p className="text-sm text-text-secondary">
              Tether Gold (XAUT) is a digital token backed by physical gold.
              Each token represents one troy ounce of gold.
            </p>
          </div>

          <div className="bg-white/60 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary">Safe & Secure</h4>
            </div>
            <p className="text-sm text-text-secondary">
              Your collateral is protected by smart contracts. Withdraw anytime
              as long as your position remains healthy.
            </p>
          </div>

          <div className="bg-white/60 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary">No Time Limit</h4>
            </div>
            <p className="text-sm text-text-secondary">
              Keep your collateral deposited as long as you want. No expiration
              dates or forced liquidations at healthy LTV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
