"use client";

import { WANDERING_ANIMALS } from "./constants";

const size = WANDERING_ANIMALS.SIZE;

export function ChickenSilhouette({ className }: { className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
    >
      {/* Realistic walking chicken silhouette */}
      <path d={[
        // Comb
        "M58 18 C58 14 62 10 64 12 C66 14 68 10 70 13 C72 10 74 14 73 17",
        // Head
        "C74 18 76 20 76 23 C76 26 74 28 72 29",
        // Beak
        "L78 27 L78 30 L72 30",
        // Wattle
        "C71 32 70 35 72 34 C71 33 70 31 69 30",
        // Neck
        "C66 32 62 36 60 40",
        // Breast
        "C58 44 56 48 54 52 C52 56 48 60 44 62",
        // Belly to legs
        "C42 63 38 63 36 62",
        // Front leg (forward stride)
        "L38 68 L42 72 L36 72 L34 68",
        // Under belly
        "L30 62 C28 62 26 61 24 60",
        // Back leg (back stride)
        "L22 66 L18 72 L14 72 L18 66 L20 60",
        // Tail rump
        "C18 58 16 54 16 50",
        // Tail feathers (upswept)
        "C14 48 10 42 8 36 C10 38 14 40 16 42",
        "C14 38 12 32 10 28 C14 32 16 36 18 40",
        // Back
        "C20 38 24 34 28 30 C32 26 38 22 44 20",
        // Top of head
        "C48 18 54 16 58 18",
        "Z",
      ].join(" ")} />
    </svg>
  );
}

export function GoatSilhouette({ className }: { className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 100"
      fill="currentColor"
      className={className}
    >
      {/* Realistic walking goat silhouette */}
      <path d={[
        // Horns (curved back)
        "M90 20 C92 14 96 8 100 6 C98 10 96 16 94 20",
        "C96 16 100 10 104 10 C102 14 98 20 96 22",
        // Top of head
        "C96 22 94 22 92 24",
        // Ear
        "C96 24 100 22 98 26 C96 26 94 26 92 26",
        // Face
        "C92 28 92 32 90 34",
        // Nose/muzzle
        "C90 36 92 38 90 38 C88 38 88 36 88 34",
        // Beard
        "C86 36 84 40 86 44 C86 42 88 38 88 34",
        // Jaw/throat
        "C86 34 84 32 82 32",
        // Neck
        "C78 32 74 34 70 36",
        // Chest
        "C68 38 66 40 64 44",
        // Front leg forward
        "C64 48 66 54 66 58 C66 62 66 66 68 70",
        // Front hoof
        "C68 72 70 72 70 70 C70 68 70 64 70 60",
        // Belly front
        "C68 58 64 56 60 56",
        // Front leg back
        "C58 56 56 58 56 62 C56 66 54 70 54 72",
        // Hoof
        "C54 74 52 74 52 72 C52 68 52 64 54 60",
        // Belly
        "C52 58 48 56 44 56 C40 56 36 56 32 58",
        // Back leg forward
        "C30 60 30 64 30 68 C30 72 28 74 28 76",
        // Hoof
        "C28 78 26 78 26 76 C26 72 28 68 28 64",
        // Under belly
        "C26 62 24 60 22 60",
        // Back leg back
        "C20 62 18 66 18 70 C18 74 16 76 16 78",
        // Hoof
        "C16 80 14 80 14 78 C14 74 16 70 18 66",
        // Rump
        "C16 62 14 58 14 54",
        // Tail (short upward)
        "C12 52 10 48 12 46 C14 48 14 52 16 52",
        // Back
        "C18 50 22 46 28 44 C34 42 42 40 50 38",
        // Spine
        "C58 36 66 34 70 36",
        // Close back to head
        "C74 34 78 32 82 32",
        "Z",
      ].join(" ")} />
    </svg>
  );
}

export function DuckSilhouette({ className }: { className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
    >
      {/* Realistic walking duck silhouette */}
      <path d={[
        // Top of head
        "M68 28 C70 24 72 22 74 22",
        // Back of head
        "C76 22 78 24 78 28 C78 30 78 32 76 34",
        // Bill
        "L84 32 C86 32 86 36 84 36 L76 36",
        // Throat
        "C76 38 74 40 72 42",
        // Neck (S-curve)
        "C68 46 64 50 62 54",
        // Breast
        "C60 58 58 62 56 66 C54 70 50 74 46 76",
        // Front foot
        "C46 78 48 80 44 82 C42 82 40 80 42 78",
        "C40 78 38 80 36 82 C34 82 34 80 36 78",
        "L40 76",
        // Belly
        "C38 74 36 72 34 72 C32 72 30 72 28 74",
        // Back foot
        "C26 76 28 78 24 80 C22 80 22 78 24 76",
        "C22 78 20 80 18 80 C16 80 18 78 20 76",
        "L24 74",
        // Under tail
        "C22 72 20 68 18 64",
        // Tail (upswept)
        "C16 60 12 56 8 54 C10 54 14 56 16 58",
        "C14 54 10 50 8 48 C12 50 16 54 18 56",
        // Rump
        "C20 54 22 50 26 48",
        // Back
        "C30 46 36 42 42 40 C48 38 54 36 60 34",
        // Top of neck
        "C62 32 64 30 66 28",
        "C66 28 68 28 68 28",
        "Z",
      ].join(" ")} />
    </svg>
  );
}

export const animalComponents = [ChickenSilhouette, GoatSilhouette, DuckSilhouette] as const;
