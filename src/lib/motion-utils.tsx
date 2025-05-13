"use client";

// Import specific components and functions from framer-motion
import {
  motion as _motion,
  AnimatePresence as _AnimatePresence,
  useScroll as _useScroll,
  useTransform as _useTransform,
  useSpring as _useSpring,
  useMotionValue as _useMotionValue,
  useAnimationControls as _useAnimationControls,
  useInView as _useInView,
  useMotionTemplate as _useMotionTemplate,
  MotionConfig as _MotionConfig,
  type Variant as _Variant,
  type Variants as _Variants,
  type AnimationDefinition as _AnimationDefinition,
  type Transition as _Transition,
  type MotionProps as _MotionProps,
  type MotionValue as _MotionValue,
  type PanInfo as _PanInfo,
  useCycle as _useCycle,
  useAnimation as _useAnimation,
  useReducedMotion as _useReducedMotion,
  useVelocity as _useVelocity,
  type HTMLMotionProps as _HTMLMotionProps,
  type SVGMotionProps as _SVGMotionProps,
  type ForwardRefComponent as _ForwardRefComponent,
  domAnimation as _domAnimation,
  domMax as _domMax,
  m as _m,
  LazyMotion as _LazyMotion,
  type LayoutGroup as _LayoutGroup,
  Reorder as _Reorder,
  useTime as _useTime,
  useWillChange as _useWillChange
} from 'framer-motion';

// Re-export with explicit named exports
export const motion = _motion;
export const AnimatePresence = _AnimatePresence;
export const useScroll = _useScroll;
export const useTransform = _useTransform;
export const useSpring = _useSpring;
export const useMotionValue = _useMotionValue;
export const useAnimationControls = _useAnimationControls;
export const useInView = _useInView;
export const useMotionTemplate = _useMotionTemplate;
export const MotionConfig = _MotionConfig;
export const useCycle = _useCycle;
export const useAnimation = _useAnimation;
export const useReducedMotion = _useReducedMotion;
export const useVelocity = _useVelocity;
export const domAnimation = _domAnimation;
export const domMax = _domMax;
export const m = _m;
export const LazyMotion = _LazyMotion;
export const Reorder = _Reorder;
export const useTime = _useTime;
export const useWillChange = _useWillChange;

// Export types
export type Variant = _Variant;
export type Variants = _Variants;
export type AnimationDefinition = _AnimationDefinition;
export type Transition = _Transition;
export type MotionProps = _MotionProps;
export type MotionValue<T = number> = _MotionValue<T>;
export type PanInfo = _PanInfo;
export type HTMLMotionProps<T extends keyof HTMLElementTagNameMap> = _HTMLMotionProps<T>;
export type SVGMotionProps<T extends keyof SVGElementTagNameMap> = _SVGMotionProps<T>;
export type ForwardRefComponent<Props, Element> = _ForwardRefComponent<Props, Element>;
export type LayoutGroup = _LayoutGroup;

// Additional animation controls
export const animate = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// Common animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
