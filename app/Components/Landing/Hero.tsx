import { Shield, Gift, ArrowRight, Lock, ChevronsUp } from "lucide-react";
import Section from "../Section";

export default function Hero() {
  return (
    <Section id="home" className="bg-gradient-to-b from-bg-main to-white">
      <div className="grid lg:grid-cols-2 gap-12 mt-24 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary">
              Unlock Cash.
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary">
              Keep Your Gold.
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg text-text-secondary max-w-2xl">
            Borrow{" "}
            <span className="font-semibold text-text-primary">
              IDR-backed stablecoins
            </span>{" "}
            instantly using tokenized gold as collateral.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="/app/borrow"
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Borrowing
              <ArrowRight size={20} />
            </a>
            <a
              href="#docs"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-bg-card border-2 border-border hover:border-primary text-text-primary hover:text-primary px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
            >
              Read Documentation
            </a>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <span className="text-text-secondary font-medium">
                Non-Custodial
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ChevronsUp size={20} className="text-primary" />
              </div>
              <span className="text-text-secondary font-medium">
                Instant Liquidity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Lock size={20} className="text-secondary" />
              </div>
              <span className="text-text-secondary font-medium">
                Keep Your Gold
              </span>
            </div>
          </div>
        </div>

        {/* Right Content - Stats Card */}
        <div className="hidden lg:block">
          <div className="bg-bg-card rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">
                  Gold-Backed Borrowing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  Base Sepolia
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                Loan Active
                <span className="text-xs text-text-secondary">Just now</span>
              </div>
            </div>

            {/* Total Savings */}
            <div className="mb-8">
              <div className="text-sm text-text-secondary uppercase tracking-wider mb-2">
                TOTAL COLLATERAL DEPOSITED
              </div>
              <div className="text-5xl font-bold text-text-primary">
                $12,450.00
              </div>
            </div>

            {/* Rewards */}
            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                  BORROWED AMOUNT
                </div>
                <div className="text-2xl font-bold text-text-primary">
                  +150,000,000{" "}
                  <span className="text-sm font-normal text-text-secondary">
                    IDRX
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Gift size={24} className="text-white" />
              </div>
            </div>

            {/* Assets & Status */}
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                  Assets
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                    X
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                    U
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                    T
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                  Status
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium text-primary">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
