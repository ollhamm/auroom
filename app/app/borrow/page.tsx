"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Info,
  AlertTriangle,
  ArrowRight,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  usePosition,
  useXautPrice,
  useHealthFactor,
  useTotalDebt,
  useBorrow,
} from "@/app/hooks/useProtocol";
import {
  formatXaut,
  formatIdrx,
  formatPriceRaw,
  formatHealthFactor,
  calculateAvailableBorrow,
} from "@/app/lib/format";
import { PROTOCOL_CONFIG, CHAIN_CONFIG } from "@/app/contracts";

export default function BorrowPage() {
  const [borrowAmount, setBorrowAmount] = useState("");
  const { address, isConnected } = useAccount();

  // Read data
  const { data: position, refetch: refetchPosition } = usePosition(address);
  const { data: price } = useXautPrice();
  const { data: healthFactorData, refetch: refetchHealth } = useHealthFactor(address);
  const { data: totalDebtData, refetch: refetchDebt } = useTotalDebt(address);

  // Write operations
  const {
    borrow,
    isPending: borrowing,
    isConfirming: borrowConfirming,
    isSuccess: borrowed,
    hash: borrowHash,
    reset: resetBorrow,
  } = useBorrow();

  // Derived values
  const collateralAmount = position?.collateralAmount || 0n;
  const currentDebt = totalDebtData || 0n;
  const priceUsd = price ? formatPriceRaw(price) : 0;
  const maxBorrowable = price
    ? calculateAvailableBorrow(collateralAmount, price, currentDebt)
    : 0n;

  const borrowValue = BigInt(Math.floor(Number(borrowAmount || 0) * 100)); // IDRX has 2 decimals
  const newTotalDebt = currentDebt + borrowValue;

  // Calculate new LTV after borrow
  const calculateNewLTV = () => {
    if (collateralAmount === 0n || !price) return 0;
    const collateralValueUsd = Number(formatXaut(collateralAmount)) * priceUsd;
    const debtValueUsd = Number(formatIdrx(newTotalDebt)) / 16000; // IDRX to USD
    if (collateralValueUsd === 0) return 0;
    return (debtValueUsd / collateralValueUsd) * 100;
  };

  const newLTV = calculateNewLTV();
  const maxLTVPercent = PROTOCOL_CONFIG.LTV_BPS / 100;
  const liquidationThreshold = PROTOCOL_CONFIG.LIQUIDATION_THRESHOLD_BPS / 100;
  const interestRate = PROTOCOL_CONFIG.ANNUAL_INTEREST_RATE_BPS / 100;

  // Estimate new health factor
  const estimatedHealthFactor = newLTV > 0 ? liquidationThreshold / newLTV : Infinity;
  const isNearLiquidation = estimatedHealthFactor < 1.5 && Number(borrowAmount) > 0;

  const canBorrow =
    isConnected &&
    collateralAmount > 0n &&
    Number(borrowAmount) > 0 &&
    borrowValue <= maxBorrowable &&
    Number(borrowAmount) >= PROTOCOL_CONFIG.MIN_BORROW / 100; // Min 10,000 IDRX

  // Refetch after successful borrow
  useEffect(() => {
    if (borrowed) {
      refetchPosition();
      refetchHealth();
      refetchDebt();
      setTimeout(() => {
        setBorrowAmount("");
        resetBorrow();
      }, 3000);
    }
  }, [borrowed]);

  const handleMaxClick = () => {
    setBorrowAmount(formatIdrx(maxBorrowable));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBorrowAmount(value.toFixed(0));
  };

  const handleBorrow = () => {
    borrow(borrowAmount);
  };

  const isLoading = borrowing || borrowConfirming;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-18">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Borrow IDRX
        </h1>
        <p className="text-text-secondary">
          Get instant liquidity while keeping your gold
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
              Please connect your wallet to borrow IDRX.
            </p>
          </div>
        ) : collateralAmount === 0n ? (
          /* No Collateral State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              No Collateral Deposited
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              You need to deposit XAUT as collateral before you can borrow IDRX.
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
            {/* Main Borrow Form */}
            <div className="lg:col-span-2">
              <div className="bg-primary/5 rounded-3xl p-8 shadow-md">
                <h2 className="text-xl font-bold text-text-primary mb-6">
                  Borrow Amount
                </h2>

                {/* Available to Borrow */}
                <div className="flex items-center justify-between mb-4 p-4 bg-white/60 rounded-2xl">
                  <span className="text-sm text-text-secondary">
                    Available to Borrow
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">
                      {formatIdrx(maxBorrowable)} IDRX
                    </span>
                  </div>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
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
                      ≈ ${(Number(borrowAmount || 0) / 16000).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <div className="mb-8">
                  <input
                    type="range"
                    min="0"
                    max={Number(formatIdrx(maxBorrowable).replace(/,/g, ""))}
                    value={Number(borrowAmount) || 0}
                    onChange={handleSliderChange}
                    disabled={isLoading}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary disabled:opacity-50"
                  />
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs text-text-secondary">0</span>
                    <span className="text-xs text-text-secondary">
                      {formatIdrx(maxBorrowable)}
                    </span>
                  </div>
                </div>

                {/* LTV Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      Loan-to-Value (LTV)
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      {newLTV.toFixed(1)}% / {maxLTVPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        newLTV === 0
                          ? "bg-gray-200"
                          : newLTV < 40
                            ? "bg-primary"
                            : newLTV < 60
                              ? "bg-secondary"
                              : "bg-error"
                      }`}
                      style={{ width: `${Math.min((newLTV / maxLTVPercent) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-text-secondary">Safe</span>
                    <span className="text-xs text-text-secondary">
                      Max LTV ({maxLTVPercent}%)
                    </span>
                  </div>
                </div>

                {/* Min borrow warning */}
                {Number(borrowAmount) > 0 && Number(borrowAmount) < PROTOCOL_CONFIG.MIN_BORROW / 100 && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">
                        Minimum Borrow Amount
                      </p>
                      <p className="text-xs text-yellow-700">
                        Minimum borrow is {(PROTOCOL_CONFIG.MIN_BORROW / 100).toLocaleString()} IDRX
                      </p>
                    </div>
                  </div>
                )}

                {/* Warning if near liquidation */}
                {isNearLiquidation && (
                  <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-error mb-1">
                        High Risk Position
                      </p>
                      <p className="text-xs text-error/80">
                        Your health factor ({estimatedHealthFactor.toFixed(2)}) is low.
                        Consider borrowing less to maintain a safer position.
                      </p>
                    </div>
                  </div>
                )}

                {/* Transaction Status */}
                {borrowHash && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-2xl">
                    {borrowConfirming && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming borrow transaction...</span>
                      </div>
                    )}
                    {borrowed && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Borrow successful!</span>
                        <a
                          href={`${CHAIN_CONFIG.blockExplorer}/tx/${borrowHash}`}
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

                {/* Terms Info */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Loan Terms</p>
                      <ul className="space-y-1 text-xs text-blue-800">
                        <li>• Interest Rate: {interestRate}% APR</li>
                        <li>• No fixed repayment schedule</li>
                        <li>• Liquidation at {liquidationThreshold}% LTV with 1% penalty</li>
                        <li>• Partial repayments allowed anytime</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleBorrow}
                  disabled={!canBorrow || isLoading || borrowed}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : borrowed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                  {borrowing
                    ? "Borrowing..."
                    : borrowConfirming
                    ? "Confirming..."
                    : borrowed
                    ? "Borrow Complete!"
                    : `Borrow ${Number(borrowAmount) > 0 ? Number(borrowAmount).toLocaleString() : ""} IDRX`}
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
                  {/* Current Collateral */}
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

                  {/* Total Debt After Borrow */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Total Debt (After)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">
                        {formatIdrx(newTotalDebt)}
                      </p>
                      <span className="text-sm text-text-secondary">IDRX</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Current: {formatIdrx(currentDebt)} IDRX
                    </p>
                  </div>

                  {/* Health Factor */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Health Factor (Est.)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-2xl font-bold ${
                          estimatedHealthFactor === Infinity
                            ? "text-text-secondary"
                            : estimatedHealthFactor >= 1.5
                              ? "text-primary"
                              : estimatedHealthFactor >= 1.2
                                ? "text-secondary"
                                : "text-error"
                        }`}
                      >
                        {estimatedHealthFactor === Infinity
                          ? formatHealthFactor(healthFactorData)
                          : estimatedHealthFactor.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {estimatedHealthFactor === Infinity
                        ? "No debt"
                        : estimatedHealthFactor >= 1.5
                          ? "Healthy position"
                          : estimatedHealthFactor >= 1.2
                            ? "Moderate risk"
                            : "High risk"}
                    </p>
                  </div>

                  {/* Interest Info */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-xs font-semibold text-text-primary mb-2">
                      Interest Info
                    </p>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <p>• Rate: {interestRate}% per year</p>
                      <p>• Compounding: Per second</p>
                      <p>• Min borrow: {(PROTOCOL_CONFIG.MIN_BORROW / 100).toLocaleString()} IDRX</p>
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
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  Instant Liquidity
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Receive IDRX instantly to your wallet. Use it for payments,
                trading, or any other purpose.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  Flexible Repayment
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Repay anytime, partially or fully. No prepayment penalties or
                fixed schedules.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  Keep Your Gold
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Your XAUT remains yours. Benefit from gold price appreciation
                while accessing cash.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
