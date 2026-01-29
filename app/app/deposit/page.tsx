"use client";

import { useState } from "react";
import { Coins, TrendingUp, Info, Fuel, ArrowRight } from "lucide-react";

export default function DepositPage() {
  // Mock data - akan diganti dengan real blockchain data
  const [depositAmount, setDepositAmount] = useState("");
  const xautBalance = 0.0; // User's XAUT balance
  const currentCollateral = 0.0; // Current deposited XAUT
  const xautPrice = 2000; // XAUT price in USD (from Chainlink)
  const userTier = 1; // 1 = 50%, 2 = 60%, 3 = 70%
  const gasEstimate = 0.0015; // Estimated gas in ETH

  // Calculate borrowing capacity based on deposit
  const calculateBorrowingCapacity = (amount: number) => {
    if (!amount || amount <= 0) return 0;
    const collateralValueUSD = amount * xautPrice;
    const ltvRatio = userTier === 1 ? 50 : userTier === 2 ? 60 : 70;
    const maxBorrowUSD = (collateralValueUSD * ltvRatio) / 100;
    const maxBorrowIDRX = maxBorrowUSD * 15384; // 1 USD = 15,384 IDRX
    return maxBorrowIDRX;
  };

  const handleMaxClick = () => {
    setDepositAmount(xautBalance.toString());
  };

  const handleDeposit = () => {
    // Will connect to smart contract
    console.log("Depositing:", depositAmount, "XAUT");
  };

  const depositValue = parseFloat(depositAmount) || 0;
  const newTotalCollateral = currentCollateral + depositValue;
  const newBorrowingCapacity = calculateBorrowingCapacity(newTotalCollateral);

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
                    {xautBalance.toFixed(4)} XAUT
                  </span>
                </div>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
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
                    ≈ ${(depositValue * xautPrice).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDeposit}
                  disabled={!depositValue || depositValue <= 0}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Approve & Deposit XAUT
                </button>

                {/* Gas Estimate */}
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                  <span>Estimated gas: ~{gasEstimate} ETH</span>
                </div>
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
                      {newTotalCollateral.toFixed(4)}
                    </p>
                    <span className="text-sm text-text-secondary">XAUT</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    ≈ ${(newTotalCollateral * xautPrice).toLocaleString()} USD
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
                      {newBorrowingCapacity.toLocaleString()}
                    </p>
                    <span className="text-sm text-text-secondary">IDRX</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    At {userTier === 1 ? "50" : userTier === 2 ? "60" : "70"}%
                    LTV (Tier {userTier})
                  </p>
                </div>

                {/* LTV Info */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-xs font-semibold text-text-primary mb-2">
                    Your Tier Benefits
                  </p>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <p>
                      • Max LTV:{" "}
                      {userTier === 1 ? "50" : userTier === 2 ? "60" : "70"}%
                    </p>
                    <p>• Liquidation Threshold: 80%</p>
                    <p>• Interest Rate: 5% APR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
