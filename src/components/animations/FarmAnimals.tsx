"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { WANDERING_ANIMALS } from "./constants";
import { useReducedMotion } from "./hooks";
import WanderingAnimal from "./WanderingAnimal";
import GrazingGoat from "./GrazingGoat";

type AnimalType = "rooster" | "goat";

export default function FarmAnimals() {
  const prefersReduced = useReducedMotion();
  const [activeAnimal, setActiveAnimal] = useState<AnimalType | null>(null);
  const [animalKey, setAnimalKey] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < WANDERING_ANIMALS.MIN_VIEWPORT_WIDTH);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const delay =
      WANDERING_ANIMALS.MIN_INTERVAL +
      Math.random() * (WANDERING_ANIMALS.MAX_INTERVAL - WANDERING_ANIMALS.MIN_INTERVAL);

    timerRef.current = setTimeout(() => {
      // Randomly pick rooster (walks) or goat (grazes)
      const pick: AnimalType = Math.random() > 0.5 ? "rooster" : "goat";
      setAnimalKey((k) => k + 1);
      setActiveAnimal(pick);
    }, delay);
  }, []);

  useEffect(() => {
    if (prefersReduced || isMobile) return;
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prefersReduced, isMobile, scheduleNext]);

  const handleComplete = useCallback(() => {
    setActiveAnimal(null);
    scheduleNext();
  }, [scheduleNext]);

  if (prefersReduced || isMobile) return null;

  return (
    <AnimatePresence>
      {activeAnimal === "rooster" && (
        <WanderingAnimal key={`rooster-${animalKey}`} onComplete={handleComplete} />
      )}
      {activeAnimal === "goat" && (
        <GrazingGoat key={`goat-${animalKey}`} onComplete={handleComplete} />
      )}
    </AnimatePresence>
  );
}
