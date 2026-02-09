"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useReducedMotion } from "./hooks";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const COOLDOWN_MIN = 18000; // 18 seconds
const COOLDOWN_MAX = 30000; // 30 seconds
const HATCH_DURATION = 3000; // how long the hatch Lottie plays
const WALK_DURATION = 2500; // how long the chick walks after hatching
const WALK_DISTANCE = 120; // px the chick walks
const INTERACTIVE_SELECTORS = "a, button, input, textarea, select, [role='button'], [onclick], label, .btn-primary, .btn-secondary";

type HatchPhase = "hatching" | "walking" | "done";

interface HatchEvent {
  x: number;
  y: number;
  id: number;
  phase: HatchPhase;
}

export default function ChickHatch() {
  const prefersReduced = useReducedMotion();
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [hatches, setHatches] = useState<HatchEvent[]>([]);
  const lastTriggerRef = useRef<number>(0);
  const idRef = useRef(0);

  useEffect(() => {
    fetch("/animations/chick-hatching.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {});
  }, []);

  const updatePhase = useCallback((id: number, phase: HatchPhase) => {
    setHatches((prev) => prev.map((h) => (h.id === id ? { ...h, phase } : h)));
  }, []);

  const removeHatch = useCallback((id: number) => {
    setHatches((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (prefersReduced || !animationData) return;

    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE_SELECTORS)) return;

    const now = Date.now();
    const cooldown = COOLDOWN_MIN + Math.random() * (COOLDOWN_MAX - COOLDOWN_MIN);
    if (now - lastTriggerRef.current < cooldown) return;

    lastTriggerRef.current = now;
    const id = ++idRef.current;

    setHatches((prev) => [...prev, { x: e.clientX, y: e.clientY, id, phase: "hatching" }]);

    // After hatch animation, switch to walking phase
    setTimeout(() => updatePhase(id, "walking"), HATCH_DURATION);

    // After walking, mark as done to trigger fade-out
    setTimeout(() => updatePhase(id, "done"), HATCH_DURATION + WALK_DURATION);

    // Remove from DOM after fade-out completes
    setTimeout(() => removeHatch(id), HATCH_DURATION + WALK_DURATION + 800);
  }, [prefersReduced, animationData, updatePhase, removeHatch]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  if (!animationData || prefersReduced) return null;

  return (
    <AnimatePresence>
      {hatches.map((hatch) => (
        <motion.div
          key={hatch.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: hatch.x - 50,
            top: hatch.y - 50,
          }}
          // Fade in the egg
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            hatch.phase === "done"
              ? { opacity: 0, x: WALK_DISTANCE + 20 }
              : hatch.phase === "walking"
              ? { opacity: 1, scale: 1, x: WALK_DISTANCE }
              : { opacity: 1, scale: 1, x: 0 }
          }
          transition={
            hatch.phase === "done"
              ? { duration: 0.6, ease: "easeOut" }
              : hatch.phase === "walking"
              ? { duration: WALK_DURATION / 1000, ease: "easeInOut" }
              : { duration: 0.5, ease: "easeOut" }
          }
        >
          <Lottie
            animationData={animationData}
            loop={false}
            style={{ width: 100, height: 100 }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
