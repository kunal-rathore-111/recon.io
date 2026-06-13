"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Globe, Brain, Clock, Trash2 } from "lucide-react"
import type { reconDataResponseType } from "@/app/actions/getRecons"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { setLongSelectedCard } from "@/lib/store/features/ui/uiSlice"
import { Switch } from "../ui/switch"
import { useTransition } from "react"
import { deleteReconAction } from "@/app/actions/deleteRecon"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ToggleIntelligenceAction } from "@/app/actions/toggleIntelligence"
import { setReconHistory } from "@/lib/store/features/reconHistory/reconHistorySlice"
import { ChromeIcon } from "../animated-icons/ChromeIcon"


export function trimString(str: string) {
    if (str.length < 24) return str;
    return str.trim().slice(0, 24) + '...'
}

export function CardComp({ recons }: { recons: reconDataResponseType[] }) {

    const dispatch = useDispatch();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    function handleDelete(reconId: string) {

        const confirmed = confirm("Are you sure to delete this target?");
        if (!confirmed) return;
        startTransition(async () => {
            const result = await deleteReconAction(reconId);
            if (result.success) {
                toast.success("Target deleted successfully!");

                router.refresh();
            }
            else {
                toast.error(result.error);
            }
        })
    }


    function handleAIToggle(recondId: string, isEnabled: boolean) {
        startTransition(async () => {

            const nextState = !isEnabled;
            const response = await ToggleIntelligenceAction(recondId, nextState)//if true then set to false;

            if (response.error) {
                toast.error(response.error);
                return;
            }
            else {
                toast.success(`AI Intelligence turned ${nextState ? "on" : "off"}!`);
                router.refresh();
            }
        })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {recons.map((recon) => {
                const isAI = recon.intelligenceEnabled;
                const TrimmedTitle = trimString(recon.title);
                return (
                    <Card
                        key={recon.id}
                        className="relative overflow-hidden border border-border/40 bg-card hover:bg-accent/5 hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group "

                    >

                        <CardHeader >
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-[17px] flex justify-between font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                                    <button className="text-xs p-1 rounded border-zinc-600  hover:shadow-[0_3px_3px_rgb(2,5,0,0.2)] shadow-black transition-all duration-300 border cursor-pointer"
                                        onClick={() =>
                                            dispatch(setReconHistory(recon.id))}>
                                        History
                                    </button>
                                    <div className="flex items-center gap-2 justify-end">

                                        <Link
                                            href={recon.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ChromeIcon size={18} />
                                        </Link>
                                        <button
                                            className=" text-red-500 cursor-pointer"
                                            disabled={isPending}
                                            onClick={() => handleDelete(recon.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 cursor-pointer" onClick={() => dispatch(setLongSelectedCard(recon))}>
                            <h1 className="text-xl">  {TrimmedTitle ?? "Untitled"}</h1>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {recon.mission ?? "No mission set"}
                            </p>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3 pb-3 bg-accent/5">
                            {/* AI Toggle button (UI only) */}
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-1.5 font-medium">
                                    <span className={`size-2 rounded-full ${isAI ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                                    <Brain className={`size-3.5 transition-colors duration-300 ${isAI ? "text-violet-500" : "text-muted-foreground"}`} />
                                    <span className={isAI ? "text-foreground font-semibold" : ""}>
                                        AI {isAI ? "On" : "Off"}
                                    </span>
                                </div>
                                <Switch checked={isAI} onClick={() => handleAIToggle(recon.id, isAI)} disabled={isPending} />

                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {new Date(recon.createdAt).toLocaleDateString()}
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
