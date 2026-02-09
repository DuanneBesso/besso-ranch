"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { EASTER_EGGS } from "./constants";
import { ChickenSilhouette } from "./AnimalSilhouettes";

export default function ChickenParade() {
  const chickens = useMemo(() => {
    return Array.from({ length: EASTER_EGGS.PARADE_CHICKEN_COUNT }, (_, i) => ({
      id: i,
      delay: i * 0.4,
      y: Math.random() * 8, // slight vertical variation
      size: 0.7 + Math.random() * 0.5, // size variation
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {chickens.map((chicken) => (
        <motion.div
          key={chicken.id}
          className="absolute"
          style={{
            bottom: 20 + chicken.y,
            color: "#8B2500", // barn-red
            opacity: 0.7,
            scale: chicken.size,
          }}
          initial={{ x: -80 }}
          animate={{ x: window.innerWidth + 80 }}
          transition={{
            duration: EASTER_EGGS.PARADE_DURATION,
            delay: chicken.delay,
            ease: "linear",
          }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChickenSilhouette />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
