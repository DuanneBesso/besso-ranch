"use client";

import { useKonamiCode, useReducedMotion } from "./hooks";
import ChickenParade from "./ChickenParade";
import EggConfetti from "./EggConfetti";

interface EasterEggManagerProps {
  confettiActive: boolean;
}

export default function EasterEggManager({ confettiActive }: EasterEggManagerProps) {
  const konamiActivated = useKonamiCode();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <>
      {konamiActivated && <ChickenParade />}
      <EggConfetti active={confettiActive} />
    </>
  );
}
