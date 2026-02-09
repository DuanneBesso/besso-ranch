"use client";

import { createContext, useContext } from "react";
import FarmAnimals from "./FarmAnimals";
import EasterEggManager from "./EasterEggManager";
import { useClickCounter } from "./hooks";

interface AnimationContextType {
  onLogoClick: () => void;
}

const AnimationContext = createContext<AnimationContextType>({
  onLogoClick: () => {},
});

export function useAnimationContext() {
  return useContext(AnimationContext);
}

export default function AnimationLayer({ children }: { children: React.ReactNode }) {
  const { triggered, onClick } = useClickCounter();

  return (
    <AnimationContext.Provider value={{ onLogoClick: onClick }}>
      {children}
      <FarmAnimals />
      <EasterEggManager confettiActive={triggered} />
    </AnimationContext.Provider>
  );
}
