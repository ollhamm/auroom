"use client";

import { ArrowRight } from "lucide-react";
import Section from "../Section";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <Section id="cta" className="bg-white">
      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Headline */}
        <motion.p
          className="text-lg text-text-secondary mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Put your gold to work.
        </motion.p>

        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Ready to unlock liquidity?
        </motion.h2>

        <motion.p
          className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Start borrowing against your gold today. No selling required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <a
            href="/app"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-10 py-5  rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Launch Auroom
            <ArrowRight size={20} />
          </a>

          <a
            href="#docs"
            className="inline-flex items-center gap-2 bg-transparent hover:bg-bg-card border-2 border-border hover:border-primary text-text-primary hover:text-primary px-10 py-5 rounded-full font-semibold text-lg transition-all duration-300"
          >
            Read Documentation
          </a>
        </motion.div>
      </motion.div>
    </Section>
  );
}
