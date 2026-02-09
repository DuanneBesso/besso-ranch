"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EASTER_EGGS } from "./constants";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ChickenParade() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/animations/rooster.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {});
  }, []);

  const chickens = useMemo(() => {
    return Array.from({ length: EASTER_EGGS.PARADE_CHICKEN_COUNT }, (_, i) => ({
      id: i,
      delay: i * 0.4,
      y: Math.random() * 8,
      size: 0.7 + Math.random() * 0.5,
    }));
  }, []);

  if (!animationData) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {chickens.map((chicken) => (
        <motion.div
          key={chicken.id}
          className="absolute"
          style={{
            bottom: 20 + chicken.y,
            opacity: 0.85,
            scale: chicken.size,
          }}
          initial={{ x: -100 }}
          animate={{ x: window.innerWidth + 100 }}
          transition={{
            duration: EASTER_EGGS.PARADE_DURATION,
            delay: chicken.delay,
            ease: "linear",
          }}
        >
          <Lottie
            animationData={animationData}
            loop
            style={{ width: 80, height: 80 }}
          />
        </motion.div>
      ))}
    </div>
  );
}
