"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { WANDERING_ANIMALS } from "./constants";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const GOAT_FILE = "/animations/goat.json";
const GRAZE_DURATION = 8; // seconds the goat stays visible

interface GrazingGoatProps {
  onComplete: () => void;
}

export default function GrazingGoat({ onComplete }: GrazingGoatProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  const position = useMemo(() => {
    // Random horizontal position (10%-80% of viewport to stay visible)
    const left = 10 + Math.random() * 70;
    return { left };
  }, []);

  useEffect(() => {
    fetch(GOAT_FILE)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {});
  }, []);

  if (!animationData) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      style={{
        bottom: WANDERING_ANIMALS.BOTTOM_OFFSET,
        left: `${position.left}%`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: WANDERING_ANIMALS.OPACITY }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      onAnimationComplete={(definition) => {
        // After the fade-in completes, schedule fade-out
        if (
          typeof definition === "object" &&
          definition !== null &&
          "opacity" in definition &&
          (definition as { opacity: number }).opacity === WANDERING_ANIMALS.OPACITY
        ) {
          setTimeout(onComplete, GRAZE_DURATION * 1000);
        }
      }}
    >
      <Lottie
        animationData={animationData}
        loop
        style={{ width: WANDERING_ANIMALS.SIZE, height: WANDERING_ANIMALS.SIZE }}
      />
    </motion.div>
  );
}
