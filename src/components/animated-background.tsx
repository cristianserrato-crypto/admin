"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-graphite-950">
      <div className="absolute inset-0 grid-plane opacity-60" />
      <motion.div
        className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ x: [0, 40, -10, 0], y: [0, -24, 18, 0], opacity: [0.5, 0.8, 0.45] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[6%] top-[18%] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
        animate={{ x: [0, -26, 16, 0], y: [0, 28, -20, 0], opacity: [0.45, 0.75, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-graphite-950 to-transparent" />
    </div>
  );
}
