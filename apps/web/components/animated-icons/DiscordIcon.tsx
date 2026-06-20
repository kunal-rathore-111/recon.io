"use client";

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface DiscordIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface DiscordIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const DRAW_VARIANTS: Variants = {
    normal: {
        pathLength: 1,
        opacity: 1,
    },
    draw: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
            duration: 0.4,
            ease: "easeInOut",
        },
    },
};

const FLOAT_VARIANTS: Variants = {
    normal: {
        y: 0,
        scale: 1,
    },
    float: {
        y: [0, -1.5, 0],
        scale: [1, 1.04, 1],
        transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
        },
    },
};

const DiscordIcon = forwardRef<DiscordIconHandle, DiscordIconProps>(
    ({ className, size = 28, onMouseEnter, onMouseLeave, ...props }, ref) => {
        const leftEyeControls = useAnimation();
        const rightEyeControls = useAnimation();
        const outlineControls = useAnimation();
        const smileControls = useAnimation();
        const svgControls = useAnimation();

        const isControlledRef = useRef(false);

        const playAnimation = async () => {
            await leftEyeControls.start("draw");
            await rightEyeControls.start("draw");
            await outlineControls.start("draw");
            await smileControls.start("draw");

            svgControls.start("float");
        };

        const resetAnimation = () => {
            leftEyeControls.start("normal");
            rightEyeControls.start("normal");
            outlineControls.start("normal");
            smileControls.start("normal");
            svgControls.start("normal");
        };

        useImperativeHandle(ref, () => {
            isControlledRef.current = true;

            return {
                startAnimation: playAnimation,
                stopAnimation: resetAnimation,
            };
        });

        const handleMouseEnter = useCallback(
            async (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseEnter?.(e);
                    return;
                }

                await playAnimation();
            },
            [onMouseEnter]
        );

        const handleMouseLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseLeave?.(e);
                    return;
                }

                resetAnimation();
            },
            [onMouseLeave]
        );

        return (
            <div
                className={cn(className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <motion.svg
                    animate={svgControls}
                    variants={FLOAT_VARIANTS}
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Left Eye */}
                    <motion.path
                        d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"
                        variants={DRAW_VARIANTS}
                        initial="normal"
                        animate={leftEyeControls}
                    />

                    {/* Right Eye */}
                    <motion.path
                        d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"
                        variants={DRAW_VARIANTS}
                        initial="normal"
                        animate={rightEyeControls}
                    />

                    {/* Main Discord Shape */}
                    <motion.path
                        d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"
                        variants={DRAW_VARIANTS}
                        initial="normal"
                        animate={outlineControls}
                    />

                    {/* Smile */}
                    <motion.path
                        d="M7 16.5c3.5 1 6.5 1 10 0"
                        variants={DRAW_VARIANTS}
                        initial="normal"
                        animate={smileControls}
                    />
                </motion.svg>
            </div>
        );
    }
);

DiscordIcon.displayName = "DiscordIcon";

export { DiscordIcon };