"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FIREFLY_GLOWS } from "./constants";
import { useReducedMotion } from "./hooks";

interface Firefly {
  id: number;
  x: number; // % from left
  y: number; // % from top
  size: number;
  duration: number;
  delay: number;
}

export default function FireflyGlows() {
  const prefersReduced = useReducedMotion();

  const fireflies = useMemo<Firefly[]>(() => {
    return Array.from({ length: FIREFLY_GLOWS.COUNT }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // keep away from edges
      y: 10 + Math.random() * 80,
      size:
        FIREFLY_GLOWS.MIN_SIZE +
        Math.random() * (FIREFLY_GLOWS.MAX_SIZE - FIREFLY_GLOWS.MIN_SIZE),
      duration:
        FIREFLY_GLOWS.MIN_DURATION +
        Math.random() * (FIREFLY_GLOWS.MAX_DURATION - FIREFLY_GLOWS.MIN_DURATION),
      delay: Math.random() * 4,
    }));
  }, []);

  if (prefersReduced) return null;

  return (
    <>
      {fireflies.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            backgroundColor: FIREFLY_GLOWS.COLOR,
            boxShadow: `0 0 ${FIREFLY_GLOWS.GLOW_RADIUS}px ${FIREFLY_GLOWS.GLOW_RADIUS / 2}px ${FIREFLY_GLOWS.COLOR}`,
          }}
          animate={{
            opacity: [0, 0.8, 0.2, 0.9, 0],
            scale: [0.8, 1.2, 0.9, 1.1, 0.8],
            x: [0, 10, -5, 8, 0],
            y: [0, -8, 4, -6, 0],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
