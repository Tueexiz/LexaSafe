"use client";

import React from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export function ScannerQR({ uri }: { uri: string }) {
  return (
    <div className="relative mx-auto flex w-48 h-48 items-center justify-center rounded-2xl bg-white p-4 shadow-2xl overflow-hidden ring-4 ring-white/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-10"
      >
        <QRCodeSVG value={uri} size={160} level="M" />
      </motion.div>

      {/* Laser Scan Effect */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_3px_rgba(6,182,212,0.8)] z-20"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Laser Fade Gradient */}
      <motion.div
        className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent to-cyan-400/20 z-10"
        initial={{ top: "-10%" }}
        animate={{ top: "90%" }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
