"use client";

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface GoogleIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface GoogleIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const GOOGLE_VARIANTS: Variants = {
    normal: {
        pathLength: 1,
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.3,
        },
    },

    draw: {
        pathLength: [0, 1],
        opacity: [0, 1],
        scale: [0.85, 1],
        transition: {
            duration: 0.6,
        },
    },

    pulse: {
        scale: [1, 1.08, 1],
        rotate: [0, 3, -3, 0],
        transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
        },
    },
};

const GoogleIcon = forwardRef<GoogleIconHandle, GoogleIconProps>(
    ({ className, size = 28, onMouseEnter, onMouseLeave, ...props }, ref) => {
        const controls = useAnimation();
        const isControlledRef = useRef(false);

        useImperativeHandle(ref, () => {
            isControlledRef.current = true;

            return {
                startAnimation: async () => {
                    await controls.start("draw");
                    controls.start("pulse");
                },

                stopAnimation: () => {
                    controls.start("normal");
                },
            };
        });

        const handleMouseEnter = useCallback(
            async (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseEnter?.(e);
                } else {
                    await controls.start("draw");
                    controls.start("pulse");
                }
            },
            [controls, onMouseEnter]
        );

        const handleMouseLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseLeave?.(e);
                } else {
                    controls.start("normal");
                }
            },
            [controls, onMouseLeave]
        );

        return (
            <div
                className={cn(className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        animate={controls}
                        initial="normal"
                        variants={GOOGLE_VARIANTS}
                        fill="currentColor"
                        d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z"
                    />
                </svg>
            </div>
        );
    }
);

GoogleIcon.displayName = "GoogleIcon";

export { GoogleIcon };