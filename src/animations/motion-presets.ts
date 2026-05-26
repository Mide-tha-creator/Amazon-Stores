export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideX = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

export const defaultTransition = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1] as const,
};
