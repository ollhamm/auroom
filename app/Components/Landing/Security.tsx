"use client";

import { Shield, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import Section from "../Section";
import { motion, Variants } from "framer-motion";

export default function Security() {
  const features = [
    {
      icon: Shield,
      title: "Smart Contract Security",
      description:
        "Built with OpenZeppelin's battle-tested security standards. All core functions protected with reentrancy guards to prevent attacks.",
      details: [
        "Reentrancy protection on all state-changing functions",
        "Solidity 0.8+ with built-in overflow checks",
        "Comprehensive unit and fuzz testing",
      ],
    },
    {
      icon: Lock,
      title: "Non-Custodial Design",
      description:
        "You maintain full control of your assets. Your XAUT collateral is locked in audited smart contracts, never held by any third party.",
      details: [
        "Your keys, your gold - always",
        "Transparent on-chain verification",
        "No intermediary custody risk",
      ],
    },
    {
      icon: RefreshCw,
      title: "Real-Time Price Oracles",
      description:
        "Chainlink price feeds ensure accurate, manipulation-resistant valuations. Freshness checks prevent stale price exploitation.",
      details: [
        "Chainlink XAUT/USD oracle integration",
        "Price staleness validation (< 1 hour)",
        "Automated liquidation protection",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Complete Transparency",
      description:
        "Every transaction is verifiable on-chain. Open source contracts deployed on Base network with full BaseScan verification.",
      details: [
        "Verified smart contracts on BaseScan",
        "Real-time position monitoring",
        "Immutable audit trail",
      ],
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <Section id="security" className="bg-bg-main">
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
          Security First
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Your assets are protected by institutional-grade security standards
          and battle-tested smart contracts.
        </p>
      </motion.div>

      <motion.div
        className="space-y-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: isEven ? 60 : -60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                isEven ? "" : "lg:grid-flow-dense"
              }`}
            >
              {/* Icon & Visual Side */}
              <div
                className={`relative ${isEven ? "lg:order-1" : "lg:order-2"}`}
              >
                <div className="relative">
                  {/* Large decorative icon background */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-2xl"></div>

                  <div className="relative bg-bg-card rounded-3xl p-12 shadow-xl">
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        {/* Main icon */}
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Icon size={48} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Feature checklist */}
                    <div className="space-y-4">
                      {feature.details.map((detail, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary"
                              />
                            </svg>
                          </div>
                          <span className="text-text-secondary text-lg leading-relaxed">
                            {detail}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <h3 className="text-3xl font-bold text-text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
