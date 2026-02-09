"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { WANDERING_ANIMALS } from "./constants";
import { animalComponents } from "./AnimalSilhouettes";

interface WanderingAnimalProps {
  onComplete: () => void;
}

export default function WanderingAnimal({ onComplete }: WanderingAnimalProps) {
  const config = useMemo(() => {
    const animalIndex = Math.floor(Math.random() * animalComponents.length);
    const goingRight = Math.random() > 0.5;
    const duration =
      WANDERING_ANIMALS.WALK_DURATION_MIN +
      Math.random() * (WANDERING_ANIMALS.WALK_DURATION_MAX - WANDERING_ANIMALS.WALK_DURATION_MIN);

    return { animalIndex, goingRight, duration };
  }, []);

  const AnimalComponent = animalComponents[config.animalIndex];

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      style={{
        bottom: WANDERING_ANIMALS.BOTTOM_OFFSET,
        opacity: WANDERING_ANIMALS.OPACITY,
        color: "#5C4033", // warm-brown
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
      {/* Subtle bobbing motion while walking */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AnimalComponent />
      </motion.div>
    </motion.div>
  );
}
