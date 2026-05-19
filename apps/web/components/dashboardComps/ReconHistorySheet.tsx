"use client"

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setReconHistory } from "@/lib/store/features/reconHistory/reconHistorySlice";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ReconHistoryOutlineComp } from "./ReconHistoryOutlineComp";


export function ReconHistorySheet() {
    const dispatch = useDispatch();
    const reconId = useSelector((state: RootState) => state.history.reconHistoryState);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            dispatch(setReconHistory(null));
        }
    };

    return (
        <Sheet open={!!reconId} onOpenChange={handleOpenChange} >
            <SheetContent
                side="right"
                showCloseButton={false}
            >
                <SheetTitle className="w-full sm:max-w-2xl p-0 border-l border-border/30 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto">
                    {reconId && (
                        <div className="p-4 md:p-6 h-full flex flex-col justify-center">
                            <ReconHistoryOutlineComp reconId={reconId} />
                        </div>
                    )}
                </SheetTitle>
            </SheetContent>
        </Sheet>
    );
}
