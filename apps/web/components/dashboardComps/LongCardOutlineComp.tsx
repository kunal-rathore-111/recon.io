"use client"

import { useMemo, useTransition } from "react";
import { useDispatch } from "react-redux";
import { setLongSelectedCard } from "@/lib/store/features/ui/uiSlice";
import type { reconDataResponseType } from "@/app/actions/getRecons";
import {
    X,
    Globe,
    Brain,
    Clock,
    Trash2,
    ExternalLink,
    Cpu,
    Calendar,
    ShoppingBag,
    Blocks,
    Newspaper,
    PlugZap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";
import { deleteReconAction } from "@/app/actions/deleteRecon";
import { toast } from "sonner";
import { ToggleIntelligenceAction } from "@/app/actions/toggleIntelligence";
import { setReconHistory } from "@/lib/store/features/reconHistory/reconHistorySlice";

const CATEGORY_MAP = {
    ecommerce: {
        label: "E-Commerce",
        icon: ShoppingBag,
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    },
    saas: {
        label: "SaaS / App",
        icon: Blocks,
        color: "text-sky-500 bg-sky-500/10 border-sky-500/20"
    },
    blog: {
        label: "Blog / News",
        icon: Newspaper,
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    api: {
        label: "API Endpoint",
        icon: PlugZap,
        color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
    },
    custom: {
        label: "Custom Web",
        icon: Globe,
        color: "text-violet-500 bg-violet-500/10 border-violet-500/20"
    }
};

interface LongCardOutlineCompProps {
    selectedCardData: reconDataResponseType;
}

export function LongCardOutlineComp({ selectedCardData }: LongCardOutlineCompProps) {
    const dispatch = useDispatch();

    const categoryInfo = useMemo(() => {
        const type = selectedCardData.type as keyof typeof CATEGORY_MAP;
        return CATEGORY_MAP[type] || CATEGORY_MAP.custom;
    }, [selectedCardData.type]);

    const isAI = selectedCardData.intelligenceEnabled;
    const isEnabled = selectedCardData.status === "enabled";
    const CategoryIcon = categoryInfo.icon;

    function handleClose() {
        dispatch(setLongSelectedCard(null));
    };

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleDelete(reconId: string) {

        const confirmed = confirm('Are you sure to delete this target?');
        if (!confirmed) return;
        else {
            startTransition(async () => {
                const result = await deleteReconAction(reconId);
                if (result.success) {
                    toast.success("Target deleted successfully.");
                    handleClose();
                    router.refresh();

                }
                else {
                    toast.error(result.error);
                }
            })
        }
    }

    function handleAItoggle(recondId: string, isEnabled: boolean) {
        const nextState = !isEnabled;
        startTransition(async () => {
            const response = await ToggleIntelligenceAction(recondId, nextState);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            else {
                toast.success(`AI Intelligence turned ${nextState ? "on" : "off"}!`);
                router.refresh();
                handleClose();
            }
        })
    }

    function handleHistory(recondId: string) {


    }

    return (
        <Card className="relative w-full border border-border/40 bg-card/65 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-y-hidden  group max-w-2xl mx-auto">


            <CardHeader className="border-b border-border/40 bg-accent/5 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="outline" className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${categoryInfo.color}`}>
                                <CategoryIcon className="size-3.5" />
                                {categoryInfo.label}
                            </Badge>

                            <Badge variant="outline" className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${isEnabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>

                                <span className={`size-1.5 rounded-full ${isEnabled ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />

                                {isEnabled ? "Active" : "Paused"}
                            </Badge>
                        </div>
                        <CardTitle className="text-xl pt-2 md:text-xl font-bold tracking-tight text-foreground  break-all whitespace-normal px-2
                        ">

                            {selectedCardData.title || "Untitled Target"}

                        </CardTitle>

                        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium mt-2">

                            <Clock className="size-3.5" />
                            ID:
                            <span className="font-mono text-[10px] bg-accent/20 px-1.5 py-0.5 rounded border border-border/40 select-all">
                                {selectedCardData.id}
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

            <CardContent className="space-y-6 pt-3 overflow-scroll mb-18 overflow-x-hidden ">
                {/* Target URL Info Box */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                        <Globe className="size-3.5 text-primary" />
                        Target Endpoint Address
                    </h3>
                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/40 bg-accent/5 hover:bg-accent/10 transition-colors">
                        <a
                            href={selectedCardData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-foreground hover:text-primary underline transition-colors truncate break-all flex items-center gap-1.5"
                        >
                            {selectedCardData.url}
                            <ExternalLink className="size-3.5 shrink-0" />
                        </a>
                    </div>
                </div>

                {/* Mission / Extraction Instructions */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                        <Cpu className="size-3.5 text-primary" />
                        Recon Mission & extraction instruction
                    </h3>
                    <div className="p-4 rounded-xl border border-border/40 bg-accent/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                        <p className="text-sm text-foreground leading-relaxed font-medium  break-all whitespace-normal">
                            {selectedCardData.mission || "No extraction instructions provided for this target."}
                        </p>
                    </div>
                </div>

                {/* Intelligence Agent Setup */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                        <Brain className="size-3.5 text-violet-500" />
                        AI Agent Intelligence
                    </h3>

                    <div className={`flex items-center cursor-pointer justify-between p-4 rounded-xl border transition-all ${isAI ? 'border-violet-500/30 bg-violet-500/5' : 'border-border/40 bg-accent/5'}`}
                        onClick={() => handleAItoggle(selectedCardData.id, isAI)} >
                        <div className="flex items-center gap-3">
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">
                                    AI Extraction Agent
                                </h4>

                            </div>
                        </div>

                        <Switch checked={isAI} disabled={isPending} />
                    </div>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-6 ">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
                            <Calendar className="size-3" /> Created On
                        </span>
                        <p className="text-sm font-semibold text-foreground">
                            {selectedCardData.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
                            <Calendar className="size-3" /> Last Checked
                        </span>
                        <p className="text-sm font-semibold text-foreground">
                            {selectedCardData.lastCheckedAt
                                ? (selectedCardData.lastCheckedAt).toLocaleDateString()
                                : "Pending Scan"}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="absolute bottom-0 w-full bg-white border-t border-border/40  py-4 flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClose()}
                    className="text-xs font-semibold cursor-pointer border-border/60 hover:bg-accent/40"
                >
                    Back to Grid
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch(setReconHistory(selectedCardData.id))}
                    className="text-xs font-semibold cursor-pointer border-border/60 hover:bg-accent/40"
                >
                    History
                </Button>

                <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs font-semibold gap-1.5 cursor-pointer shadow-md  transition-all duration-400"
                    disabled={isPending}
                    onClick={() => handleDelete(selectedCardData.id)}
                >
                    <Trash2 className="size-3.5" />
                    Delete Target
                </Button>
            </CardFooter>
        </Card>
    );
}
