"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "./hooks";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const COOLDOWN_MIN = 18000; // 18 seconds
const COOLDOWN_MAX = 30000; // 30 seconds
const INTERACTIVE_SELECTORS = "a, button, input, textarea, select, [role='button'], [onclick], label, .btn-primary, .btn-secondary";

interface HatchEvent {
  x: number;
  y: number;
  id: number;
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

  const handleClick = useCallback((e: MouseEvent) => {
    if (prefersReduced || !animationData) return;

    // Skip if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE_SELECTORS)) return;

    // Check cooldown
    const now = Date.now();
    const cooldown = COOLDOWN_MIN + Math.random() * (COOLDOWN_MAX - COOLDOWN_MIN);
    if (now - lastTriggerRef.current < cooldown) return;

    lastTriggerRef.current = now;
    const id = ++idRef.current;

    setHatches((prev) => [...prev, { x: e.clientX, y: e.clientY, id }]);

    // Remove after animation plays (~3 seconds)
    setTimeout(() => {
      setHatches((prev) => prev.filter((h) => h.id !== id));
    }, 3000);
  }, [prefersReduced, animationData]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  if (!animationData || prefersReduced) return null;

  return (
    <>
      {hatches.map((hatch) => (
        <div
          key={hatch.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: hatch.x - 50,
            top: hatch.y - 50,
          }}
        >
          <Lottie
            animationData={animationData}
            loop={false}
            style={{ width: 100, height: 100 }}
          />
        </div>
      ))}
    </>
  );
}
