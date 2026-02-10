/**
 * Animation utilities and constants for Lark Base-inspired animations
 *
 * These animations match the smooth, professional feel of Lark Base
 */

// Easing functions
export const easings = {
  // Standard easing for most animations
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  // Emphasized easing for important actions
  emphasized: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  // Decelerated easing for entering elements
  decelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  // Accelerated easing for exiting elements
  accelerated: 'cubic-bezier(0.4, 0.0, 1, 1)',
  // Sharp easing for quick transitions
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
};

// Duration constants (in milliseconds)
export const durations = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195,
};

// Common animation classes
export const animations = {
  // Fade animations
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',

  // Slide animations
  slideInRight: 'animate-slideInRight',
  slideOutRight: 'animate-slideOutRight',
  slideInLeft: 'animate-slideInLeft',
  slideOutLeft: 'animate-slideOutLeft',
  slideInUp: 'animate-slideInUp',
  slideOutDown: 'animate-slideOutDown',

  // Scale animations
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut',

  // Bounce animations
  bounceIn: 'animate-bounceIn',

  // Pulse animations
  pulse: 'animate-pulse',

  // Spin animations
  spin: 'animate-spin',
};

// Transition classes for Tailwind
export const transitions = {
  all: 'transition-all',
  colors: 'transition-colors',
  opacity: 'transition-opacity',
  shadow: 'transition-shadow',
  transform: 'transition-transform',

  // Combined transitions
  standard: 'transition-all duration-300 ease-in-out',
  fast: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',

  // Specific property transitions
  bg: 'transition-colors duration-200 ease-in-out',
  border: 'transition-colors duration-200 ease-in-out',
  scale: 'transition-transform duration-200 ease-in-out',
  slidePanel: 'transition-transform duration-300 ease-out',
  modal: 'transition-all duration-200 ease-out',
};

// Hover effects
export const hoverEffects = {
  lift: 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
  glow: 'hover:shadow-md hover:shadow-emerald-200 transition-shadow duration-200',
  scale: 'hover:scale-105 transition-transform duration-200',
  scaleSmall: 'hover:scale-102 transition-transform duration-200',
  brighten: 'hover:brightness-110 transition-all duration-200',
  opacity: 'hover:opacity-80 transition-opacity duration-200',
};

// Loading animations
export const loadingAnimations = {
  spinner: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
};

// Stagger animation delays for lists
export const staggerDelays = [
  'delay-0',
  'delay-75',
  'delay-100',
  'delay-150',
  'delay-200',
  'delay-300',
];

// Spring animation configuration (for framer-motion if needed)
export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// Smooth spring configuration
export const smoothSpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

// Gentle spring configuration
export const gentleSpringConfig = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};
