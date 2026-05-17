"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Globe, Brain, Clock, Trash2, ExternalLink } from "lucide-react"
import type { reconDataResponseType } from "@/app/actions/getRecons"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { setLongSelectedCard } from "@/lib/store/features/ui/uiSlice"


function trimString(str: string) {
    return str.trim().slice(0, 34) + '...'
}

export function CardComp({ recons }: { recons: reconDataResponseType[] }) {
    const dispatch = useDispatch();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {recons.map((recon) => {
                const isAI = recon.intelligenceEnabled;
                const TrimmedTitle = trimString(recon.title);
                return (
                    <Card
                        key={recon.id}
                        className="relative overflow-hidden border border-border/40 bg-card hover:bg-accent/5 hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group cursor-pointer"
                        onClick={() => dispatch(setLongSelectedCard(recon))}
                    >

                        <CardHeader >
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg flex justify-between font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">

                                    <h1>  {TrimmedTitle ?? "Untitled"}</h1>

                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={recon.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Globe className="size-4" />
                                        </Link>
                                        <button
                                            className=" text-red-500 cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1">
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

                                <label className="relative inline-flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isAI}
                                        readOnly
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 rounded-full bg-muted border border-border peer-focus:outline-none transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-violet-500 peer-checked:to-indigo-500 peer-checked:border-transparent">
                                        <div className={`w-3.5 h-3.5 rounded-full bg-background border border-border/40 shadow-sm transition-transform duration-300 ease-out ${isAI ? "transform translate-x-3.5" : "transform translate-x-0"}`} />
                                    </div>
                                </label>
                            </div>

                            {/* Link */}
                            <div className="flex items-center gap-3 font-medium" onClick={(e) => e.stopPropagation()}>
                                <a
                                    href={recon.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-primary transition-colors cursor-pointer flex items-center gap-0.5"
                                >
                                    Link
                                    <ExternalLink className="size-3" />
                                </a>
                                <div className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {new Date(recon.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
