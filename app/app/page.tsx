"use client";

import { Coins, Wallet, CheckCircle, TrendingUp, Archive } from "lucide-react";

export default function AppDashboard() {
  const collateralAmount: number = 0; // XAUT deposited
  const borrowedAmount: number = 0; // IDRX borrowed
  const healthFactor: number = 0; // 0 = no position, >1 = healthy, <1 = liquidatable
  const currentLTV: number = 0; // Current Loan-to-Value ratio
  const maxLTV: number = 50; // User's max LTV based on tier (50%, 60%, or 70%)
  const accruedInterest: number = 0; // Interest earned over time
  const availableToBorrow: number = 0; // Max borrowable amount

  const getHealthColor = (health: number) => {
    if (health === 0) return "text-text-secondary";
    if (health >= 1.5) return "text-success";
    if (health >= 1.2) return "text-secondary";
    return "text-error";
  };

  const getLTVColor = (ltv: number) => {
    if (ltv === 0) return "bg-gray-200";
    if (ltv < 50) return "bg-success";
    if (ltv < 70) return "bg-secondary";
    return "bg-error";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-18">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Dashboard Overview
        </h1>
        <p className="text-text-secondary">
          Cash out your needs, keep your gold
        </p>
      </div>
      <div className="bg-gradient-to-b from-bg-main to-white shadow-xl rounded-tl-[4rem] rounded-3xl p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Collateral Card */}
          <div className="bg-gradient-to-br from-bg-white to-primary/20 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide">
                  Collateral
                </p>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">
                {collateralAmount.toFixed(4)}
              </p>
              <p className="text-sm text-text-secondary">XAUT</p>
            </div>
          </div>

          {/* Borrowed Card */}
          <div className="bg-gradient-to-br from-bg-white to-primary/20 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide">
                  Borrowed
                </p>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">
                {borrowedAmount.toLocaleString()}
              </p>
              <p className="text-sm text-text-secondary">IDRX</p>
            </div>
          </div>

          {/* Health Factor Card */}
          <div className="bg-gradient-to-br from-bg-white to-primary/20 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide">
                  Health Factor
                </p>
              </div>
            </div>
            <div>
              <p
                className={`text-3xl font-bold mb-1 ${getHealthColor(
                  healthFactor,
                )}`}
              >
                {healthFactor === 0 ? "—" : healthFactor.toFixed(2)}
              </p>
              <p className="text-sm text-text-secondary">
                {healthFactor === 0
                  ? "No active position"
                  : healthFactor >= 1
                    ? "Healthy"
                    : "At Risk"}
              </p>
            </div>
          </div>

          {/* Available to Borrow Card */}
          <div className="bg-gradient-to-br from-bg-white to-primary/20 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide">
                  Available
                </p>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">
                {availableToBorrow.toLocaleString()}
              </p>
              <p className="text-sm text-text-secondary">IDRX</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-6">
          {/* Position Details */}
          <div className="lg:col-span-2 bg-transparent rounded-3xl p-8 shadow-md">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Position Details
            </h2>

            {collateralAmount === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No Collateral Yet
                </h3>
                <p className="text-text-secondary mb-6">
                  Deposit XAUT to start borrowing IDRX
                </p>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                  Deposit XAUT
                </button>
              </div>
            ) : (
              <>
                {/* LTV Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      Loan-to-Value (LTV)
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      {currentLTV}% / {maxLTV}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getLTVColor(
                        currentLTV,
                      )}`}
                      style={{ width: `${(currentLTV / maxLTV) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-text-secondary">Safe</span>
                    <span className="text-xs text-text-secondary">
                      Max ({maxLTV}%)
                    </span>
                  </div>
                </div>

                {/* Debt Breakdown */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  <h3 className="font-semibold text-text-primary mb-4">
                    Debt Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">
                        Principal
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {borrowedAmount.toLocaleString()} IDRX
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">
                        Accrued Interest (5% APR)
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {accruedInterest.toFixed(2)} IDRX
                      </span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-text-primary">
                          Total Debt
                        </span>
                        <span className="font-bold text-text-primary">
                          {(borrowedAmount + accruedInterest).toLocaleString()}{" "}
                          IDRX
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
