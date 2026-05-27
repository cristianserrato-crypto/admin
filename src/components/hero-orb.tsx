"use client";

import { motion } from "framer-motion";

export function HeroOrb() {
  const nodes = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[500px]">
      <motion.div
        className="absolute inset-[9%] rounded-full border border-cyan-200/20 shadow-glow"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[18%] rounded-full border border-blue-300/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-[28%] rounded-full bg-cyan-300/10 blur-2xl" />
      <div className="absolute inset-[30%] rounded-full border border-cyan-100/30 bg-slate-950/30 backdrop-blur-xl" />
      {nodes.map((node) => {
        const angle = (node / nodes.length) * Math.PI * 2;
        const radius = node % 2 ? 43 : 35;
        return (
          <motion.span
            key={node}
            className="absolute left-1/2 top-1/2 size-2 rounded-full bg-cyan-200 shadow-glow"
            style={{
              x: `calc(${Math.cos(angle) * radius}vw / 10)`,
              y: `calc(${Math.sin(angle) * radius}vw / 10)`,
            }}
            animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.8 + node * 0.08, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
      <div className="absolute inset-x-[22%] top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
      <div className="absolute inset-y-[22%] left-1/2 w-px bg-gradient-to-b from-transparent via-blue-200/50 to-transparent" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.16),transparent_52%)]" />
    </div>
  );
}
