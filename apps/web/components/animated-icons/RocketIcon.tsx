"use client";

import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface RocketIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface RocketIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const FIRE_KEYFRAMES = `
  @keyframes rocket-fire-flicker {
    0%   { d: path("M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"); opacity: 0.9; }
    25%  { d: path("M4.5 16.5c-1.7 1.26-2.5 5.6-2.5 5.6s4.24-0.8 5.5-2.6c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"); opacity: 1; }
    50%  { d: path("M4.5 16.5c-1.3 1.26-1.8 4.6-1.8 4.6s3.54-0.3 4.8-1.6c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"); opacity: 0.85; }
    75%  { d: path("M4.5 16.5c-1.8 1.26-2.7 5.8-2.7 5.8s4.44-1.0 5.7-2.8c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"); opacity: 1; }
    100% { d: path("M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"); opacity: 0.9; }
  }
  @keyframes rocket-body-float {
    0%   { transform: translate(0px, 0px); }
    20%  { transform: translate(1.5px, -1px); }
    40%  { transform: translate(2.5px, -0.5px); }
    60%  { transform: translate(1.5px, -1.5px); }
    80%  { transform: translate(2px, -0.5px); }
    100% { transform: translate(0px, 0px); }
  }
  .rocket-fire-active {
    animation: rocket-fire-flicker 0.55s ease-in-out infinite;
    transform-origin: 4px 20px;
  }
  .rocket-body-active {
    animation: rocket-body-float 2.2s ease-in-out infinite;
  }
`;

const RocketIcon = forwardRef<RocketIconHandle, RocketIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const isControlledRef = useRef(false);
    const fireTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      if (typeof document !== "undefined" && !document.getElementById("rocket-styles")) {
        const style = document.createElement("style");
        style.id = "rocket-styles";
        style.textContent = FIRE_KEYFRAMES;
        document.head.appendChild(style);
      }
    }, []);

    const startAnim = useCallback(() => {
      setIsAnimating(true);
    }, []);

    const stopAnim = useCallback(() => {
      if (fireTimerRef.current) clearTimeout(fireTimerRef.current);
      setIsAnimating(false);
    }, []);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return { startAnimation: startAnim, stopAnimation: stopAnim };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) { onMouseEnter?.(e); return; }
        startAnim();
        onMouseEnter?.(e);
      },
      [startAnim, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) { onMouseLeave?.(e); return; }
        stopAnim();
        onMouseLeave?.(e);
      },
      [stopAnim, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          width={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <g className={isAnimating ? "rocket-body-active" : ""}>
            <path
              className={isAnimating ? "rocket-fire-active" : ""}
              d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
            />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </g>
        </svg>
      </div>
    );
  }
);

RocketIcon.displayName = "RocketIcon";
export { RocketIcon };