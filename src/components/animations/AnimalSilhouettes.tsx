"use client";

import { WANDERING_ANIMALS } from "./constants";

const size = WANDERING_ANIMALS.SIZE;

export function ChickenSilhouette({ className }: { className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      {/* Simple chicken silhouette */}
      <path d="M20 48 L20 40 Q16 36 16 30 Q16 22 22 18 Q26 14 30 14 Q32 10 36 10 Q38 10 38 14 Q42 16 44 20 Q48 24 48 30 Q48 36 44 40 L44 48 L40 48 L40 44 L24 44 L24 48 Z" />
      {/* Comb */}
      <path d="M34 10 Q36 6 38 8 Q40 4 42 8 Q40 10 38 10 Z" />
      {/* Beak */}
      <path d="M48 26 L54 28 L48 30 Z" />
      {/* Tail feathers */}
      <path d="M16 30 Q10 24 12 18 Q14 22 16 24 Z" />
    </svg>
  );
}

export function GoatSilhouette({ className }: { className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      {/* Body */}
      <ellipse cx="30" cy="34" rx="16" ry="10" />
      {/* Head */}
      <ellipse cx="50" cy="24" rx="7" ry="6" />
      {/* Neck */}
      <path d="M42 28 Q46 26 48 28 Q46 32 42 34 Z" />
      {/* Legs */}
      <rect x="18" y="42" width="3" height="12" rx="1" />
      <rect x="26" y="42" width="3" height="12" rx="1" />
      <rect x="34" y="42" width="3" height="12" rx="1" />
      <rect x="40" y="42" width="3" height="10" rx="1" />
      {/* Horns */}
      <path d="M52 18 Q54 12 56 14" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M48 18 Q46 12 44 14" strokeWidth="2" stroke="currentColor" fill="none" />
      {/* Beard */}
      <path d="M54 28 Q56 34 54 32" />
      {/* Tail */}
      <path d="M14 30 Q10 26 12 24" strokeWidth="2" stroke="currentColor" fill="none" />
    </svg>
  );
}

export function DuckSilhouette({ className }: { className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      {/* Body */}
      <ellipse cx="28" cy="40" rx="16" ry="10" />
      {/* Neck */}
      <path d="M40 36 Q44 32 46 26 Q48 22 46 20" strokeWidth="4" stroke="currentColor" fill="none" />
      {/* Head */}
      <circle cx="46" cy="18" r="6" />
      {/* Beak */}
      <path d="M52 18 L58 16 L58 20 Z" />
      {/* Tail */}
      <path d="M12 36 Q8 30 10 28 Q12 32 14 34 Z" />
      {/* Feet */}
      <path d="M22 50 L18 54 L26 54 Z" />
      <path d="M34 50 L30 54 L38 54 Z" />
    </svg>
  );
}

export const animalComponents = [ChickenSilhouette, GoatSilhouette, DuckSilhouette] as const;
