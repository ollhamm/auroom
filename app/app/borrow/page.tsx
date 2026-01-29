"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Info,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function BorrowPage() {
  // Mock data - akan diganti dengan real blockchain data
  const [borrowAmount, setBorrowAmount] = useState("");
  const collateralAmount: number = 0; // XAUT deposited
  const xautPrice: number = 2000; // XAUT price in USD
  const currentBorrowed = 0; // Already borrowed IDRX
  const accruedInterest = 0; // Interest yang sudah terhitung
  const userTier = 1; // 1 = 50%, 2 = 60%, 3 = 70%
  const interestRate = 5; // 5% APR
  const liquidationThreshold = 80; // 80%

  // Calculate max borrowable amount
  const calculateMaxBorrow = () => {
    if (collateralAmount <= 0) return 0;
    const collateralValueUSD = collateralAmount * xautPrice;
    const ltvRatio = userTier === 1 ? 50 : userTier === 2 ? 60 : 70;
    const maxBorrowUSD = (collateralValueUSD * ltvRatio) / 100;
    const maxBorrowIDRX = maxBorrowUSD * 15384; // 1 USD = 15,384 IDRX
    const totalDebt = currentBorrowed + accruedInterest;
    return Math.max(0, maxBorrowIDRX - totalDebt);
  };

  // Calculate LTV after borrowing
  const calculateLTV = (borrowValue: number) => {
    if (collateralAmount <= 0) return 0;
    const totalDebt = currentBorrowed + accruedInterest + borrowValue;
    const debtValueUSD = totalDebt / 15384;
    const collateralValueUSD = collateralAmount * xautPrice;
    return (debtValueUSD / collateralValueUSD) * 100;
  };

  // Calculate health factor
  const calculateHealthFactor = (borrowValue: number) => {
    const currentLTV = calculateLTV(borrowValue);
    if (currentLTV === 0) return Infinity;
    return liquidationThreshold / currentLTV;
  };

  const maxBorrowable = calculateMaxBorrow();
  const borrowValue = parseFloat(borrowAmount) || 0;
  const newLTV = calculateLTV(borrowValue);
  const healthFactor = calculateHealthFactor(borrowValue);
  const maxLTVPercent = userTier === 1 ? 50 : userTier === 2 ? 60 : 70;

  const handleMaxClick = () => {
    setBorrowAmount(maxBorrowable.toFixed(0));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBorrowAmount(value.toFixed(0));
  };

  const handleBorrow = () => {
    // Will connect to smart contract
    console.log("Borrowing:", borrowAmount, "IDRX");
  };

  const isNearLiquidation = healthFactor < 1.5;
  const canBorrow =
    collateralAmount > 0 && borrowValue > 0 && borrowValue <= maxBorrowable;

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
        {collateralAmount === 0 ? (
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
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl">
              Deposit Collateral
            </button>
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
                      {maxBorrowable.toLocaleString()} IDRX
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
                      className="w-full text-4xl font-bold text-text-primary bg-white rounded-3xl px-6 py-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <button
                        onClick={handleMaxClick}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm rounded-full transition-all"
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
                      ≈ $
                      {(borrowValue / 15384).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USD
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <div className="mb-8">
                  <input
                    type="range"
                    min="0"
                    max={maxBorrowable}
                    value={borrowValue}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs text-text-secondary">0</span>
                    <span className="text-xs text-text-secondary">
                      {maxBorrowable.toLocaleString()}
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
                          : newLTV < 50
                            ? "bg-primary"
                            : newLTV < 70
                              ? "bg-secondary"
                              : "bg-error"
                      }`}
                      style={{ width: `${(newLTV / maxLTVPercent) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-text-secondary">Safe</span>
                    <span className="text-xs text-text-secondary">
                      Max LTV ({maxLTVPercent}%)
                    </span>
                  </div>
                </div>

                {/* Warning if near liquidation */}
                {isNearLiquidation && borrowValue > 0 && (
                  <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-error mb-1">
                        High Risk Position
                      </p>
                      <p className="text-xs text-error/80">
                        Your health factor ({healthFactor.toFixed(2)}) is low.
                        Consider borrowing less to maintain a safer position.
                      </p>
                    </div>
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Loan Terms</p>
                      <ul className="space-y-1 text-xs text-blue-800">
                        <li>• Interest Rate: {interestRate}% APR</li>
                        <li>• No fixed repayment schedule</li>
                        <li>
                          • Liquidation at {liquidationThreshold}% LTV with 1%
                          penalty
                        </li>
                        <li>• Partial repayments allowed anytime</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleBorrow}
                  disabled={!canBorrow}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Borrow {borrowValue > 0
                    ? borrowValue.toLocaleString()
                    : ""}{" "}
                  IDRX
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
                        {collateralAmount.toFixed(4)}
                      </p>
                      <span className="text-sm text-text-secondary">XAUT</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      ≈ ${(collateralAmount * xautPrice).toLocaleString()} USD
                    </p>
                  </div>

                  {/* Total Debt After Borrow */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Total Debt
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">
                        {(
                          currentBorrowed +
                          accruedInterest +
                          borrowValue
                        ).toLocaleString()}
                      </p>
                      <span className="text-sm text-text-secondary">IDRX</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Principal + Interest
                    </p>
                  </div>

                  {/* Health Factor */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Health Factor
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-2xl font-bold ${
                          healthFactor === Infinity
                            ? "text-text-secondary"
                            : healthFactor >= 1.5
                              ? "text-primary"
                              : healthFactor >= 1.2
                                ? "text-secondary"
                                : "text-error"
                        }`}
                      >
                        {healthFactor === Infinity
                          ? "∞"
                          : healthFactor.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {healthFactor === Infinity
                        ? "No debt"
                        : healthFactor >= 1.5
                          ? "Healthy position"
                          : healthFactor >= 1.2
                            ? "Moderate risk"
                            : "High risk"}
                    </p>
                  </div>

                  {/* Interest Info */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-xs font-semibold text-text-primary mb-2">
                      Interest Calculation
                    </p>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <p>• Rate: {interestRate}% per year</p>
                      <p>• Accrued: {accruedInterest.toFixed(2)} IDRX</p>
                      <p>• Compounding: Per second</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info Section */}
        {collateralAmount > 0 && (
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
