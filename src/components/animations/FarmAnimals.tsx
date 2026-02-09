"use client";

import { useState, useEffect, useCallback } from "react";
import { WANDERING_ANIMALS } from "./constants";
import { useReducedMotion } from "./hooks";
import WanderingAnimal from "./WanderingAnimal";

export default function FarmAnimals() {
  const prefersReduced = useReducedMotion();
  const [showAnimal, setShowAnimal] = useState(false);
  const [animalKey, setAnimalKey] = useState(0);
  const [isMobile, setIsMobile] = useState(true); // default to true to avoid flash on SSR

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < WANDERING_ANIMALS.MIN_VIEWPORT_WIDTH);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const scheduleNext = useCallback(() => {
    const delay =
      WANDERING_ANIMALS.MIN_INTERVAL +
      Math.random() * (WANDERING_ANIMALS.MAX_INTERVAL - WANDERING_ANIMALS.MIN_INTERVAL);

    const timer = setTimeout(() => {
      setAnimalKey((k) => k + 1);
      setShowAnimal(true);
    }, delay);

    return timer;
  }, []);

  useEffect(() => {
    if (prefersReduced || isMobile) return;

    const timer = scheduleNext();
    return () => clearTimeout(timer);
  }, [prefersReduced, isMobile, scheduleNext]);

  const handleComplete = useCallback(() => {
    setShowAnimal(false);
    // Schedule the next animal after the current one finishes
    const timer = scheduleNext();
    return () => clearTimeout(timer);
  }, [scheduleNext]);

  if (prefersReduced || isMobile || !showAnimal) return null;

  return <WanderingAnimal key={animalKey} onComplete={handleComplete} />;
}
