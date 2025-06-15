"use client";
import { useRef, useEffect, FC, useState } from "react";
import gsap from "gsap";

const GSAPCursor: FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // For touch devices, return null
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  useEffect(() => {
    // Initialize GSAP animation
    let xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 2,
      ease: "power2.out",
    });
    let yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 2,
      ease: "power2.out",
    });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full border-2 border-dotted border-red-500 bg-transparent pointer-events-none z-60"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="w-2 h-2 rounded-full bg-black dark:bg-white absolute pointer-events-none z-60"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)", // Centers the dot on the cursor
        }}
      />
    </div>
  );
};

export default GSAPCursor;
