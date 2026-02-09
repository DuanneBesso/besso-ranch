"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { NATURE_PARTICLES } from "./constants";
import { useReducedMotion } from "./hooks";

interface Particle {
  id: number;
  x: number; // % from left
  y: number; // % from top (start position)
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function NatureParticles() {
  const prefersReduced = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: NATURE_PARTICLES.COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 60 + Math.random() * 40, // start in lower portion
      size:
        NATURE_PARTICLES.MIN_SIZE +
        Math.random() * (NATURE_PARTICLES.MAX_SIZE - NATURE_PARTICLES.MIN_SIZE),
      opacity:
        NATURE_PARTICLES.MIN_OPACITY +
        Math.random() * (NATURE_PARTICLES.MAX_OPACITY - NATURE_PARTICLES.MIN_OPACITY),
      duration:
        NATURE_PARTICLES.MIN_DURATION +
        Math.random() * (NATURE_PARTICLES.MAX_DURATION - NATURE_PARTICLES.MIN_DURATION),
      delay: Math.random() * 8,
    }));
  }, []);

  if (prefersReduced) return null;

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: NATURE_PARTICLES.COLOR,
          }}
          animate={{
            y: [0, -200, -400],
            x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}
