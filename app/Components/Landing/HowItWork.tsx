"use client";

import { Wallet, DollarSign, ArrowUpDown, Trophy } from "lucide-react";
import Section from "../Section";
import { motion, Variants } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Wallet,
      title: "Deposit XAUT",
      description:
        "Deposit gold-backed tokens (XAUT) as collateral into your secure vault.",
      color: "primary",
    },
    {
      number: "02",
      icon: DollarSign,
      title: "Borrow IDRX Instantly",
      description:
        "Get instant access to IDRX stablecoin liquidity without selling your gold.",
      color: "primary",
    },
    {
      number: "03",
      icon: ArrowUpDown,
      title: "Repay Anytime",
      description:
        "Flexible repayment with no early penalties. Pay back at your own pace.",
      color: "primary",
    },
    {
      number: "04",
      icon: Trophy,
      title: "Withdraw Your Gold",
      description:
        "Once your loan is repaid, withdraw your XAUT collateral anytime.",
      color: "primary",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <Section id="how-it-works" className="bg-white">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
          How It Works
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Get liquidity from your gold in 4 simple steps. No selling required.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative bg-bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              {/* Number Badge - Top Right Corner */}
              <div className="absolute top-4 right-4">
                <span
                  className={`text-4xl font-bold ${
                    isEven ? "text-primary" : "text-primary"
                  } transition-colors duration-300`}
                >
                  {step.number}
                </span>
              </div>

              {/* Connector Line - Hidden on mobile, shown on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-border -z-10"></div>
              )}

              <div className="text-center pt-4">
                {/* Icon Circle */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-full ${
                      isEven ? "bg-primary/10" : "bg-primary/10"
                    } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      size={28}
                      className={isEven ? "text-primary" : "text-primary"}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
