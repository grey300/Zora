"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function ExperienceLayer() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let frame;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dotRef.current?.style.setProperty("transform", `translate3d(${mouseX}px, ${mouseY}px, 0)`);
    };
    const setInteractive = (event) => {
      const active = event.target.closest("a, button, input, textarea, select, [role='button']");
      ringRef.current?.classList.toggle("is-interactive", Boolean(active));
    };
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${value})`);
    };
    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ringRef.current?.style.setProperty("transform", `translate3d(${ringX}px, ${ringY}px, 0)`);
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", setInteractive, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", setInteractive);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      anchors: { offset: -80 },
      prevent: (node) => Boolean(node.closest?.("[data-native-scroll], [role='dialog'], textarea, pre")),
    });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
