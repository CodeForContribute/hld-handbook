"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, suffix = "", duration = 1100 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    let started = false;
    const run = (t0) => {
      const step = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(eased * value));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        run(performance.now());
        io.disconnect();
      }
    });
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <strong ref={ref}>
      {n}
      {suffix}
    </strong>
  );
}
