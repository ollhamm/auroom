"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Info,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function RepayPage() {
  // Mock data - akan diganti dengan real blockchain data
  const [repayAmount, setRepayAmount] = useState("");
  const collateralAmount: number = 1.5; // XAUT deposited
  const xautPrice: number = 2000; // XAUT price in USD
  const principalBorrowed = 15000000; // 15M IDRX principal
  const accruedInterest = 750000; // 750K IDRX interest
  const totalDebt = principalBorrowed + accruedInterest; // 15.75M IDRX
  const userTier = 1; // 1 = 50%, 2 = 60%, 3 = 70%
  const interestRate = 5; // 5% APR
  const liquidationThreshold = 80; // 80%
  const idrxBalance = 20000000; // 20M IDRX in wallet

  // Calculate LTV after repayment
  const calculateLTV = (repayValue: number) => {
    if (collateralAmount <= 0) return 0;
    const remainingDebt = totalDebt - repayValue;
    const debtValueUSD = remainingDebt / 15384;
    const collateralValueUSD = collateralAmount * xautPrice;
    return (debtValueUSD / collateralValueUSD) * 100;
  };

  // Calculate health factor after repayment
  const calculateHealthFactor = (repayValue: number) => {
    const currentLTV = calculateLTV(repayValue);
    if (currentLTV === 0) return Infinity;
    return liquidationThreshold / currentLTV;
  };

  const repayValue = parseFloat(repayAmount) || 0;
  const newLTV = calculateLTV(repayValue);
  const healthFactor = calculateHealthFactor(repayValue);
  const maxLTVPercent = userTier === 1 ? 50 : userTier === 2 ? 60 : 70;
  const currentLTV = calculateLTV(0);

  // Calculate how payment is split between interest and principal
  const calculatePaymentSplit = (amount: number) => {
    if (amount <= 0) return { toInterest: 0, toPrincipal: 0 };

    // Interest is always paid first
    const toInterest = Math.min(amount, accruedInterest);
    const toPrincipal = Math.max(0, amount - accruedInterest);

    return { toInterest, toPrincipal };
  };

  const paymentSplit = calculatePaymentSplit(repayValue);

  const handleMaxClick = () => {
    const maxRepayable = Math.min(totalDebt, idrxBalance);
    setRepayAmount(maxRepayable.toFixed(0));
  };

  const handlePercentageClick = (percentage: number) => {
    const amount = (totalDebt * percentage) / 100;
    const capped = Math.min(amount, idrxBalance);
    setRepayAmount(capped.toFixed(0));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setRepayAmount(value.toFixed(0));
  };

  const handleRepay = () => {
    // Will connect to smart contract
    console.log("Repaying:", repayAmount, "IDRX");
  };

  const maxRepayable = Math.min(totalDebt, idrxBalance);
  const canRepay = repayValue > 0 && repayValue <= maxRepayable;
  const isFullPayoff = repayValue >= totalDebt;

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
        {totalDebt === 0 ? (
          /* No Debt State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              No Outstanding Debt
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              You have successfully repaid all your loans. Your collateral is
              now fully available for withdrawal.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl">
              Withdraw Collateral
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Repay Form */}
            <div className="lg:col-span-2">
              <div className="bg-primary/5 rounded-3xl p-8 shadow-md">
                <h2 className="text-xl font-bold text-text-primary mb-6">
                  Repayment Amount
                </h2>

                {/* Current Debt Breakdown */}
                <div className="mb-6 p-4 bg-white/60 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-text-primary">
                      Total Outstanding Debt
                    </span>
                    <span className="text-lg font-bold text-text-primary">
                      {totalDebt.toLocaleString()} IDRX
                    </span>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        Principal
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {principalBorrowed.toLocaleString()} IDRX
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        Accrued Interest
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {accruedInterest.toLocaleString()} IDRX
                      </span>
                    </div>
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
                      {idrxBalance.toLocaleString()} IDRX
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
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

                {/* Input Field */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
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
                      {(repayValue / 15384).toLocaleString(undefined, {
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
                    max={maxRepayable}
                    value={repayValue}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs text-text-secondary">0</span>
                    <span className="text-xs text-text-secondary">
                      {maxRepayable.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Breakdown */}
                {repayValue > 0 && (
                  <div className="mb-6 p-4 bg-white/60 rounded-2xl">
                    <p className="text-sm font-semibold text-text-primary mb-3">
                      Payment Breakdown
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          To Interest
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {paymentSplit.toInterest.toLocaleString()} IDRX
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          To Principal
                        </span>
                        <span className="text-sm font-medium text-text-primary">
                          {paymentSplit.toPrincipal.toLocaleString()} IDRX
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* LTV Progress After Repayment */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      LTV After Repayment
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-secondary line-through">
                        {currentLTV.toFixed(1)}%
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {newLTV.toFixed(1)}% / {maxLTVPercent}%
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
                      style={{ width: `${(newLTV / maxLTVPercent) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-text-secondary">
                      {isFullPayoff ? "Debt Free!" : "Improved"}
                    </span>
                    <span className="text-xs text-text-secondary">
                      Max LTV ({maxLTVPercent}%)
                    </span>
                  </div>
                </div>

                {/* Full Payoff Notice */}
                {isFullPayoff && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">
                        Full Loan Payoff
                      </p>
                      <p className="text-xs text-text-secondary">
                        This will fully repay your loan. Your collateral will be
                        available for withdrawal after confirmation.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleRepay}
                  disabled={!canRepay}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Repay {repayValue > 0 ? repayValue.toLocaleString() : ""} IDRX
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
                  {/* Collateral (Unchanged) */}
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

                  {/* Remaining Debt After Repayment */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wide block mb-2">
                      Remaining Debt
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">
                        {(totalDebt - repayValue).toLocaleString()}
                      </p>
                      <span className="text-sm text-text-secondary">IDRX</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-secondary line-through">
                        {totalDebt.toLocaleString()}
                      </span>
                      {repayValue > 0 && (
                        <span className="text-xs text-primary font-semibold">
                          -{repayValue.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Health Factor After Repayment */}
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
                          : healthFactor.toFixed(2)}
                      </p>
                      {repayValue > 0 && (
                        <TrendingUp className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {healthFactor === Infinity
                        ? "No debt - Perfect!"
                        : healthFactor >= 1.5
                          ? "Healthy position"
                          : healthFactor >= 1.2
                            ? "Moderate risk"
                            : "High risk"}
                    </p>
                  </div>

                  {/* Interest Saved */}
                  {repayValue > 0 && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-xs font-semibold text-text-primary mb-2">
                        Future Interest Saved
                      </p>
                      <div className="space-y-1 text-xs text-text-secondary">
                        <p>• Current APR: {interestRate}%</p>
                        <p>
                          • Estimated savings: ~
                          {((repayValue * interestRate) / 100).toLocaleString()}{" "}
                          IDRX/year
                        </p>
                        <p>• Compounding stops on repaid amount</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info Section */}
        {totalDebt > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  No Penalties
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Repay anytime without penalties. Partial or full repayments are
                always welcome.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  Improve Health
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Every repayment improves your health factor and reduces
                liquidation risk.
              </p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text-primary">
                  Unlock Collateral
                </h4>
              </div>
              <p className="text-sm text-text-secondary">
                Full repayment unlocks your collateral for withdrawal. Get your
                gold back anytime.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
