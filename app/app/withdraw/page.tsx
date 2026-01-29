"use client";

import { useState } from "react";
import {
  Coins,
  TrendingDown,
  Info,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function WithdrawPage() {
  // Mock data - akan diganti dengan real blockchain data
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const collateralAmount: number = 1.5; // XAUT deposited
  const xautPrice: number = 2000; // XAUT price in USD
  const currentBorrowed = 15000000; // 15M IDRX borrowed
  const accruedInterest = 750000; // 750K IDRX interest
  const totalDebt = currentBorrowed + accruedInterest; // 15.75M IDRX
  const userTier = 1; // 1 = 50%, 2 = 60%, 3 = 70%
  const liquidationThreshold = 80; // 80%

  // Calculate max withdrawable amount
  const calculateMaxWithdraw = () => {
    if (collateralAmount <= 0) return 0;
    if (totalDebt === 0) return collateralAmount; // Can withdraw all if no debt

    const maxLTVPercent = userTier === 1 ? 50 : userTier === 2 ? 60 : 70;
    const debtValueUSD = totalDebt / 15384;
    const minCollateralUSD = debtValueUSD / (maxLTVPercent / 100);
    const minCollateralXAUT = minCollateralUSD / xautPrice;

    const maxWithdrawXAUT = collateralAmount - minCollateralXAUT;
    return Math.max(0, maxWithdrawXAUT);
  };

  // Calculate LTV after withdrawal
  const calculateLTV = (withdrawValue: number) => {
    if (totalDebt === 0) return 0;
    const remainingCollateral = collateralAmount - withdrawValue;
    if (remainingCollateral <= 0) return Infinity;

    const debtValueUSD = totalDebt / 15384;
    const collateralValueUSD = remainingCollateral * xautPrice;
    return (debtValueUSD / collateralValueUSD) * 100;
  };

  // Calculate health factor after withdrawal
  const calculateHealthFactor = (withdrawValue: number) => {
    const currentLTV = calculateLTV(withdrawValue);
    if (currentLTV === 0) return Infinity;
    if (currentLTV === Infinity) return 0;
    return liquidationThreshold / currentLTV;
  };

  const maxWithdrawable = calculateMaxWithdraw();
  const withdrawValue = parseFloat(withdrawAmount) || 0;
  const newLTV = calculateLTV(withdrawValue);
  const healthFactor = calculateHealthFactor(withdrawValue);
  const maxLTVPercent = userTier === 1 ? 50 : userTier === 2 ? 60 : 70;
  const currentLTV =
    totalDebt === 0
      ? 0
      : (totalDebt / 15384 / (collateralAmount * xautPrice)) * 100;

  const handleMaxClick = () => {
    setWithdrawAmount(maxWithdrawable.toFixed(4));
  };

  const handlePercentageClick = (percentage: number) => {
    const amount = (maxWithdrawable * percentage) / 100;
    setWithdrawAmount(amount.toFixed(4));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWithdrawAmount(value.toFixed(4));
  };

  const handleWithdraw = () => {
    // Will connect to smart contract
    console.log("Withdrawing:", withdrawAmount, "XAUT");
  };

  const isNearMaxLTV = newLTV > maxLTVPercent * 0.9; // Warning at 90% of max LTV
  const isExceedingMaxLTV = newLTV > maxLTVPercent;
  const canWithdraw =
    withdrawValue > 0 && withdrawValue <= maxWithdrawable && !isExceedingMaxLTV;

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
        {collateralAmount === 0 ? (
          /* No Collateral State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coins className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              No Collateral Available
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              You don't have any XAUT deposited. Deposit collateral first to
              start using the platform.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl">
              Deposit Collateral
            </button>
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
                      {collateralAmount.toFixed(4)} XAUT
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-text-secondary">Value</span>
                    <span className="text-sm font-medium text-text-primary">
                      ≈ ${(collateralAmount * xautPrice).toLocaleString()} USD
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
                      {maxWithdrawable.toFixed(4)} XAUT
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                {totalDebt > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <button
                      onClick={() => handlePercentageClick(25)}
                      className="px-4 py-3 bg-white hover:bg-primary/10 border-2 border-gray-200 hover:border-primary text-text-primary font-semibold rounded-2xl transition-all"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => handlePercentageClick(50)}
                      className="px-4 py-3 bg-white hover:bg-primary/10 border-2 border-gray-200 hover:border-primary text-text-primary font-semibold rounded-2xl transition-all"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => handlePercentageClick(75)}
                      className="px-4 py-3 bg-white hover:bg-primary/10 border-2 border-gray-200 hover:border-primary text-text-primary font-semibold rounded-2xl transition-all"
                    >
                      75%
                    </button>
                    <button
                      onClick={() => handlePercentageClick(100)}
                      className="px-4 py-3 bg-white hover:bg-primary/10 border-2 border-gray-200 hover:border-primary text-text-primary font-semibold rounded-2xl transition-all"
                    >
                      100%
                    </button>
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
                          XAUT
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 px-6">
                    <span className="text-sm text-text-secondary">
                      ≈ $
                      {(withdrawValue * xautPrice).toLocaleString(undefined, {
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
                    max={maxWithdrawable}
                    step="0.0001"
                    value={withdrawValue}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs text-text-secondary">0</span>
                    <span className="text-xs text-text-secondary">
                      {maxWithdrawable.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* LTV Progress After Withdrawal */}
                {totalDebt > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        LTV After Withdrawal
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-text-secondary line-through">
                          {currentLTV.toFixed(1)}%
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            isExceedingMaxLTV
                              ? "text-error"
                              : newLTV > maxLTVPercent * 0.9
                                ? "text-secondary"
                                : "text-text-primary"
                          }`}
                        >
                          {newLTV === Infinity ? "∞" : newLTV.toFixed(1)}% /{" "}
                          {maxLTVPercent}%
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
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-text-secondary">Safe</span>
                      <span className="text-xs text-text-secondary">
                        Max LTV ({maxLTVPercent}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* Warning if approaching max LTV */}
                {isNearMaxLTV && withdrawValue > 0 && !isExceedingMaxLTV && (
                  <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-secondary mb-1">
                        Approaching Max LTV
                      </p>
                      <p className="text-xs text-text-secondary">
                        Your LTV will be {newLTV.toFixed(1)}% after withdrawal.
                        Consider withdrawing less to maintain a safer position.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error if exceeding max LTV */}
                {isExceedingMaxLTV && (
                  <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-error mb-1">
                        Cannot Withdraw This Amount
                      </p>
                      <p className="text-xs text-error/80">
                        This withdrawal would exceed your maximum LTV of{" "}
                        {maxLTVPercent}%. Maximum you can withdraw is{" "}
                        {maxWithdrawable.toFixed(4)} XAUT.
                      </p>
                    </div>
                  </div>
                )}

                {/* Full Withdrawal Notice (No Debt) */}
                {totalDebt === 0 && withdrawValue === collateralAmount && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">
                        Full Collateral Withdrawal
                      </p>
                      <p className="text-xs text-text-secondary">
                        You're withdrawing all your collateral. You can deposit
                        again anytime to start borrowing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleWithdraw}
                  disabled={!canWithdraw}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Withdraw {withdrawValue > 0
                    ? withdrawValue.toFixed(4)
                    : ""}{" "}
                  XAUT
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
                        {(collateralAmount - withdrawValue).toFixed(4)}
                      </p>
                      <span className="text-sm text-text-secondary">XAUT</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-secondary line-through">
                        {collateralAmount.toFixed(4)}
                      </span>
                      {withdrawValue > 0 && (
                        <span className="text-xs text-error font-semibold">
                          -{withdrawValue.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Total Debt (if any) */}
                  {totalDebt > 0 && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                      <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                        Total Debt
                      </span>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-primary">
                          {totalDebt.toLocaleString()}
                        </p>
                        <span className="text-sm text-text-secondary">
                          IDRX
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Unchanged
                      </p>
                    </div>
                  )}

                  {/* Health Factor After Withdrawal */}
                  {totalDebt > 0 && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                      <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                        Health Factor
                      </span>
                      <div className="flex items-baseline gap-2">
                        <p
                          className={`text-2xl font-bold ${
                            healthFactor === Infinity
                              ? "text-primary"
                              : healthFactor >= 1.5
                                ? "text-primary"
                                : healthFactor >= 1.2
                                  ? "text-secondary"
                                  : "text-error"
                          }`}
                        >
                          {healthFactor === Infinity
                            ? "∞"
                            : healthFactor === 0
                              ? "0.00"
                              : healthFactor.toFixed(2)}
                        </p>
                        {withdrawValue > 0 && healthFactor < Infinity && (
                          <TrendingDown className="w-5 h-5 text-error" />
                        )}
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
                  )}

                  {/* Withdrawal Value */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-xs font-semibold text-text-primary mb-2">
                      You Will Receive
                    </p>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <p>• {withdrawValue.toFixed(4)} XAUT</p>
                      <p>
                        • ≈ ${(withdrawValue * xautPrice).toLocaleString()} USD
                      </p>
                      <p>• Direct to your wallet</p>
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
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  Your Gold, Your Control
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Withdraw your XAUT anytime. Your gold remains under your full
                control and ownership.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">Safe Limits</h4>
              </div>
              <p className="text-sm text-text-secondary">
                The system ensures you maintain a healthy position and prevents
                withdrawals that would put you at risk.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  Instant Transfer
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Withdrawals are processed immediately on-chain. Your XAUT
                arrives in your wallet instantly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
