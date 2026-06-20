"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
// useSpring kept for smooth cursor follow

export default function LuxuryCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);



  useEffect(() => {
    setMounted(true);
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleHoverIn = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) setHovered(true);
    };
    const handleHoverOut = () => setHovered(false);

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleHoverIn);
    document.addEventListener("mouseout", handleHoverOut);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleHoverIn);
      document.removeEventListener("mouseout", handleHoverOut);
    };
  }, [mouseX, mouseY, visible]);

  // Render nothing on server and on touch devices — avoids hydration mismatch
  if (!mounted) return null;
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      animate={{ opacity: visible ? 1 : 0, scale: clicked ? 0.7 : hovered ? 1.8 : 1 }}
      transition={{ duration: 0.12, scale: { type: "spring", stiffness: 400, damping: 25 } }}
    >
      <div className="w-3 h-3 rounded-full bg-champagne/70" />
    </motion.div>
  );
}
