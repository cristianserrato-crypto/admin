"use client";

import { useEffect } from "react";

export function AppleHomeEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -80px 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const scrollY = window.scrollY;

      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax ?? 0.05);
        const offset = Math.max(-30, Math.min(30, scrollY * speed));
        item.style.setProperty("--parallax-y", `${offset}px`);
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
