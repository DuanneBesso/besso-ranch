"use client";

import { useEffect } from "react";
import { EASTER_EGGS } from "./constants";

interface EggConfettiProps {
  active: boolean;
}

export default function EggConfetti({ active }: EggConfettiProps) {
  useEffect(() => {
    if (!active) return;

    // Dynamically import canvas-confetti to avoid bundle cost
    import("canvas-confetti").then((confettiModule) => {
      const confetti = confettiModule.default;

      // First burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.15, y: 0.3 },
        colors: [...EASTER_EGGS.CONFETTI_COLORS],
        shapes: ["circle"],
        gravity: 0.8,
        ticks: 200,
      });

      // Second burst slightly delayed
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 90,
          origin: { x: 0.2, y: 0.25 },
          colors: [...EASTER_EGGS.CONFETTI_COLORS],
          shapes: ["circle"],
          gravity: 0.8,
          ticks: 200,
        });
      }, 150);
    });
  }, [active]);

  return null;
}
