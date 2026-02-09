"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { WANDERING_ANIMALS } from "./constants";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const animalFiles = [
  "/animations/rooster.json",
  "/animations/goat.json",
  "/animations/chick-hatching.json",
  "/animations/goose.json",
  "/animations/ducks.json",
];

interface WanderingAnimalProps {
  onComplete: () => void;
}

export default function WanderingAnimal({ onComplete }: WanderingAnimalProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  const config = useMemo(() => {
    const animalIndex = Math.floor(Math.random() * animalFiles.length);
    const goingRight = Math.random() > 0.5;
    const duration =
      WANDERING_ANIMALS.WALK_DURATION_MIN +
      Math.random() * (WANDERING_ANIMALS.WALK_DURATION_MAX - WANDERING_ANIMALS.WALK_DURATION_MIN);

    return { animalIndex, goingRight, duration };
  }, []);

  useEffect(() => {
    fetch(animalFiles[config.animalIndex])
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {});
  }, [config.animalIndex]);

  if (!animationData) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      style={{
        bottom: WANDERING_ANIMALS.BOTTOM_OFFSET,
        opacity: WANDERING_ANIMALS.OPACITY,
      }}
      initial={{
        x: config.goingRight ? -WANDERING_ANIMALS.SIZE : window.innerWidth + WANDERING_ANIMALS.SIZE,
        scaleX: config.goingRight ? 1 : -1,
      }}
      animate={{
        x: config.goingRight ? window.innerWidth + WANDERING_ANIMALS.SIZE : -WANDERING_ANIMALS.SIZE,
      }}
      transition={{
        duration: config.duration,
        ease: "linear",
      }}
      onAnimationComplete={onComplete}
    >
      <Lottie
        animationData={animationData}
        loop
        style={{ width: WANDERING_ANIMALS.SIZE, height: WANDERING_ANIMALS.SIZE }}
      />
    </motion.div>
  );
}
