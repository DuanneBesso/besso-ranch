"use client";

import { useState, useCallback, useRef } from "react";
import { EASTER_EGGS } from "../constants";

export function useClickCounter(): { triggered: boolean; onClick: () => void } {
  const [triggered, setTriggered] = useState(false);
  const clickTimesRef = useRef<number[]>([]);

  const onClick = useCallback(() => {
    const now = Date.now();
    clickTimesRef.current.push(now);

    // Remove clicks outside the time window
    clickTimesRef.current = clickTimesRef.current.filter(
      (t) => now - t < EASTER_EGGS.LOGO_CLICK_WINDOW
    );

    if (clickTimesRef.current.length >= EASTER_EGGS.LOGO_CLICK_COUNT) {
      setTriggered(true);
      clickTimesRef.current = [];
      // Reset after confetti finishes
      setTimeout(() => setTriggered(false), 3000);
    }
  }, []);

  return { triggered, onClick };
}
