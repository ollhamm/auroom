"use client";

import { Shield, Zap, Coins, TrendingUp, Lock, RefreshCw } from "lucide-react";
import Section from "../Section";
import { motion, Variants } from "framer-motion";

export default function Benefits() {
  const benefits = [
    {
      icon: Lock,
      title: "Non-Custodial",
      description:
        "You retain full ownership of your gold. Your XAUT remains in your control at all times.",
      color: "primary",
    },
    {
      icon: Zap,
      title: "Instant Liquidity",
      description:
        "Borrow IDRX instantly without lengthy approval processes. Access funds when you need them.",
      color: "primary",
    },
    {
      icon: Coins,
      title: "Keep Your Gold",
      description:
        "Don't sell your appreciating assets. Use gold as collateral while maintaining exposure to price gains.",
      color: "secondary",
    },
    {
      icon: RefreshCw,
      title: "Flexible Repayment",
      description:
        "Pay back anytime with no early repayment penalties. Full control over your loan lifecycle.",
      color: "primary",
    },
    {
      icon: TrendingUp,
      title: "Competitive Rates",
      description:
        "Enjoy low interest rates powered by efficient onchain lending protocols on Base network.",
      color: "secondary",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description:
        "Built on audited smart contracts with Chainlink oracles. Every transaction is verifiable onchain.",
      color: "primary",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <Section
      id="benefits"
      className="bg-gradient-to-b from bg-white to-bg-main"
    >
      <motion.div
        className="text-start mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
          Why Choose AuRoom
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl">
          Cash out your cash needs, while keeping your gold. Get the best of
          both worlds.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="relative bg-bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="text-center pt-4">
                {/* Icon Circle */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-full ${
                      benefit.color === "primary"
                        ? "bg-primary/10"
                        : "bg-secondary/10"
                    } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      size={28}
                      className={
                        benefit.color === "primary"
                          ? "text-primary"
                          : "text-secondary"
                      }
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
