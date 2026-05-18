"use client"

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setLongSelectedCard } from "@/lib/store/features/ui/uiSlice";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LongCardOutlineComp } from "./LongCardOutlineComp";


export function LongCardSheet() {
    const dispatch = useDispatch();
    const { longSelectedCard } = useSelector((state: RootState) => state.ui);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            dispatch(setLongSelectedCard(null));
        }
    };

    return (
        <Sheet open={!!longSelectedCard} onOpenChange={handleOpenChange}>
            <SheetContent
                side="right"
                showCloseButton={false}

            >
                <SheetTitle className="w-full sm:max-w-2xl p-0 border-l border-border/30 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto">
                    {longSelectedCard && (
                        <div className="p-4 md:p-6 h-full flex flex-col justify-center">
                            <LongCardOutlineComp selectedCardData={longSelectedCard} />
                        </div>
                    )}
                </SheetTitle>
            </SheetContent>
        </Sheet>
    );
}
