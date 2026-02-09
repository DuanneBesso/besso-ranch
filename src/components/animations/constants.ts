// Animation configuration constants
// All timing, sizes, opacity, and color values in one place

export const WANDERING_ANIMALS = {
  /** How often a new animal appears (ms) */
  MIN_INTERVAL: 30000,
  MAX_INTERVAL: 60000,
  /** Size of animal silhouettes (px) */
  SIZE: 60,
  /** Opacity of silhouettes */
  OPACITY: 0.3,
  /** How long the walk animation takes (seconds) */
  WALK_DURATION_MIN: 12,
  WALK_DURATION_MAX: 20,
  /** Distance from bottom of viewport (px) */
  BOTTOM_OFFSET: 20,
  /** Minimum viewport width to show animals */
  MIN_VIEWPORT_WIDTH: 768,
} as const;

export const NATURE_PARTICLES = {
  /** Number of floating dust motes in hero */
  COUNT: 12,
  /** Size range (px) */
  MIN_SIZE: 3,
  MAX_SIZE: 6,
  /** Opacity range */
  MIN_OPACITY: 0.2,
  MAX_OPACITY: 0.5,
  /** Float duration range (seconds) */
  MIN_DURATION: 8,
  MAX_DURATION: 16,
  /** Color */
  COLOR: "rgba(253, 245, 230, 0.4)", // cream with transparency
} as const;

export const FIREFLY_GLOWS = {
  /** Number of fireflies */
  COUNT: 6,
  /** Size range (px) */
  MIN_SIZE: 4,
  MAX_SIZE: 8,
  /** Glow radius (px) */
  GLOW_RADIUS: 20,
  /** Pulse duration range (seconds) */
  MIN_DURATION: 3,
  MAX_DURATION: 6,
  /** Color */
  COLOR: "rgba(218, 195, 80, 0.6)", // soft gold glow
} as const;

export const EASTER_EGGS = {
  /** Konami code sequence */
  KONAMI_SEQUENCE: [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
  ] as string[],
  /** Number of chickens in the parade */
  PARADE_CHICKEN_COUNT: 8,
  /** Duration of parade (seconds) */
  PARADE_DURATION: 6,
  /** Logo clicks needed for confetti */
  LOGO_CLICK_COUNT: 5,
  /** Time window for logo clicks (ms) */
  LOGO_CLICK_WINDOW: 3000,
  /** Confetti colors - egg-themed */
  CONFETTI_COLORS: ["#FDF5E6", "#F5DEB3", "#DEB887", "#D2B48C", "#DAC350", "#8B2500"],
} as const;
