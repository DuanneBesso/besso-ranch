"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { EASTER_EGGS } from "../constants";

export function useKonamiCode(): boolean {
  const [activated, setActivated] = useState(false);
  const inputRef = useRef<string[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    inputRef.current.push(e.key);

    // Only keep the last N keys (length of konami sequence)
    if (inputRef.current.length > EASTER_EGGS.KONAMI_SEQUENCE.length) {
      inputRef.current = inputRef.current.slice(-EASTER_EGGS.KONAMI_SEQUENCE.length);
    }

    // Check if current input matches the sequence
    const matches = inputRef.current.every(
      (key, i) => key === EASTER_EGGS.KONAMI_SEQUENCE[i]
    );

    if (matches && inputRef.current.length === EASTER_EGGS.KONAMI_SEQUENCE.length) {
      setActivated(true);
      inputRef.current = [];
      // Reset after parade finishes
      setTimeout(() => setActivated(false), EASTER_EGGS.PARADE_DURATION * 1000 + 500);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return activated;
}
