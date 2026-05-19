"use client"

import { useDispatch } from "react-redux";
import { setReconHistory } from "@/lib/store/features/reconHistory/reconHistorySlice";
import {
    X,
    Clock,
    History,
    Sparkles,
    ArrowUpRight,
    Minus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { fetchReconHistoryAction } from "@/app/actions/reconHistory";
import { toast } from "sonner";

interface ReconHistoryOutlineCompProps {
    reconId: string;
}

export function ReconHistoryOutlineComp({ reconId }: ReconHistoryOutlineCompProps) {
    const dispatch = useDispatch();

    const [history, setHistory] = useState<any>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {

        startTransition(async () => {
            const data = await fetchReconHistoryAction(reconId);
            if (data?.historyData) {
                setHistory(data.historyData)
            }
            else {
                toast.error(data.error);
            }
        })
    }, [reconId])


    function handleClose() {
        dispatch(setReconHistory(null));
    }

    return (
        <Card className="relative w-full border border-border/40 bg-card/65 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-y-hidden group max-w-2xl mx-auto">

            {/* ── Header ── */}
            <CardHeader className="border-b border-border/40 bg-accent/5 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="outline" className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-violet-500 bg-violet-500/10 border-violet-500/20">
                                <History className="size-3.5" />
                                Detective Log
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted-foreground/5 border-border/40">
                                {history.length} Scans
                            </Badge>
                        </div>
                        <CardTitle className="text-xl pt-2 md:text-xl font-bold tracking-tight text-foreground break-all whitespace-normal px-2">
                            Scan History Timeline
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium mt-1">
                            <Clock className="size-3.5" />
                            Recon ID:
                            <span className="font-mono text-[10px] bg-accent/20 px-1.5 py-0.5 rounded border border-border/40 select-all">
                                {reconId}
                            </span>
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="rounded-full hover:bg-accent/40 size-8 shrink-0 border border-border/20 cursor-pointer"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            </CardHeader>


            {/* ── Content ── */}
            <CardContent className="space-y-4 pt-5 overflow-y-auto mb-18 overflow-x-hidden">

                {/* Loading State */}
                {isPending ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="size-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground font-medium animate-pulse">
                            Fetching intelligence logs...
                        </p>
                    </div>
                ) : history.length === 0 ? (

                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="p-4 bg-accent/20 rounded-full border border-border/40">
                            <History className="size-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-foreground">No scans recorded yet</h4>
                            <p className="text-xs text-muted-foreground max-w-xs mt-1">
                                The detective hasn&apos;t run any scans on this target. Once the AI agent runs, history will appear here.
                            </p>
                        </div>
                    </div>

                ) : (

                    /* ── Timeline Entries ── */
                    <div className="relative border-l-2 border-border/60 pl-5 ml-3 space-y-6">
                        {history.map((snapshot: any) => {
                            const isChanged = snapshot.status === "changed";

                            return (
                                <div key={snapshot.id} className="relative group/item">

                                    {/* Timeline dot */}
                                    <span className={`absolute -left-[25px] top-2 size-3 rounded-full border-2  bg-background transition-all ${isChanged
                                        ? "border-emerald-500 ring-4 ring-emerald-500/10"
                                        : "border-border/80 group-hover/item:border-violet-500/60"
                                        }`}>
                                        <span className={`absolute inset-0.5 rounded-full animate-ping ${isChanged ? ' bg-emerald-500' : ' bg-violet-500'}`} />
                                    </span>


                                    {/* Snapshot Card */}
                                    <div className={`p-4 rounded-xl border transition-all duration-300 space-y-3 ${isChanged
                                        ? "border-emerald-500/30 bg-emerald-500/[0.03] hover:border-emerald-500/50"
                                        : "border-border/40 bg-accent/5 hover:border-border/80"
                                        }`}>

                                        {/* Top row: timestamp + status badge */}
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                <Clock className="size-3.5" />
                                                {snapshot.createdAt.toLocaleString()}
                                            </div>
                                            <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isChanged
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-muted-foreground/10 text-muted-foreground border-border/40"
                                                }`}>
                                                {isChanged ? (
                                                    <><ArrowUpRight className="size-3" /> Delta Detected</>
                                                ) : (
                                                    <><Minus className="size-3" /> No Change</>
                                                )}
                                            </Badge>
                                        </div>


                                        {/* Extracted data snapshot */}
                                        {snapshot.data && (
                                            <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-2">
                                                <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">
                                                    Captured Data
                                                </span>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {Object.entries(snapshot.data).map(([key, value]) => (
                                                        <div key={key} className="flex flex-col gap-0.5 p-2 rounded-md bg-accent/10 border border-border/20">
                                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                                {key}
                                                            </span>
                                                            <span className="text-sm font-bold text-foreground truncate">
                                                                {String(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}


                                        {/* AI Insight */}
                                        {snapshot.insight && (
                                            <div className="p-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.03] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <Sparkles className="size-3.5 text-violet-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500">
                                                        AI Analysis
                                                    </span>
                                                </div>
                                                <p className="text-xs text-foreground leading-relaxed font-medium">
                                                    {snapshot.insight}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>


            {/* ── Footer ── */}
            <CardFooter className="absolute bottom-0 w-full bg-white border-t border-border/40 py-4 flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClose}
                    className="text-xs font-semibold cursor-pointer border-border/60 hover:bg-accent/40"
                >
                    Close History
                </Button>
                <p className="text-[10px] text-muted-foreground font-medium">
                    {history.length} scan{history.length !== 1 ? "s" : ""} recorded
                </p>
            </CardFooter>
        </Card>
    );
}
