import { RefObject } from "react";

export interface IconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

export function animateByRef(AnimateRef: RefObject<IconHandle | null>) {
    return {
        onMouseEnter: () => {
            if (AnimateRef.current) {
                AnimateRef.current.startAnimation();
            }
        },
        onMouseLeave: () => {
            if (AnimateRef.current) {
                AnimateRef.current.stopAnimation();
            }
        }
    }
}