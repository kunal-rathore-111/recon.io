import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    Button,
    toast
} from "@repo/ui";
import { useReconSnapshots } from "@/hooks/react-query-hooks/useRecon";
import type { ReconTarget } from "@/Types/recon";
import {
    History,
    Loader2,
    FileText,
    Terminal,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

interface Props {
    target: ReconTarget;
    onClose: () => void;
}

export function SnapshotsDrawer({ target, onClose }: Props) {
    const { data: response, isLoading } = useReconSnapshots(target.id);
    const snapshots = response?.data || [];

    return (
        <Sheet open= {!!target
} onOpenChange = { onClose } >
    <SheetContent className="sm:max-w-xl border-l-zinc-800 bg-zinc-950 p-0 text-zinc-100 overflow-y-auto" >
        <div className="flex flex-col h-full" >
            <SheetHeader className="p-6 border-b border-zinc-800 text-start" >
                <div className="flex items-center gap-3" >
                    <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400" >
                        <History className="h-5 w-5" />
                            </div>
                            < div >
                            <SheetTitle className="text-zinc-100 text-start" > Intelligence History </SheetTitle>
                                < SheetDescription className = "text-zinc-500 line-clamp-1 text-start" >
                                    { target.url }
                                    </SheetDescription>
                                    </div>
                                    </div>
                                    </SheetHeader>

                                    < div className = "flex-1" >
                                        {
                                            isLoading?(
              <div className = "flex h-full flex-col items-center justify-center gap-4 py-20" >
                                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                        <p className="text-sm text-zinc-500" > Retrieving intelligence logs...</p>
                                            </div>
            ) : snapshots.length > 0 ? (
    <div className= "p-6 space-y-8" >
    {
        snapshots.map((snapshot, idx) => (
            <div key= { snapshot.id } className = "relative pl-8 border-l border-zinc-800/50 pb-4 text-start" >
            <div className="absolute -left-[5.5px] top-0 h-[11px] w-[11px] rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] border-2 border-zinc-950" />

        <div className="mb-4 flex items-center justify-between" >
        <div className="flex flex-col gap-1" >
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500" >
        <Clock className="h-3 w-3" />
        Log Entry #{ snapshots.length - idx }
        </div>
        < div className = "text-xs text-zinc-400" >
        { format(new Date(snapshot.createdAt), "MMMM do, yyyy · HH:mm:ss")
    }
    </div>
    </div>
    < StatusBadge status = { snapshot.status } />
        </div>

        < div className = "group relative rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-5 shadow-xl transition-all hover:border-indigo-500/30" >
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800/50 pb-3" >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400" >
                    <Terminal className="h-3.5 w-3.5" />
                        Intelligence Analysis
                            </div>
                            < Button
variant = "ghost"
size = "icon"
className = "h-7 w-7 rounded-lg text-zinc-500 hover:text-indigo-400"
onClick = {() => {
    navigator.clipboard.writeText(snapshot.insight || "");
    toast.success("Intelligence copied to clipboard");
}}
                        >
    <svg className="h-3.5 w-3.5" fill = "none" viewBox = "0 0 24 24" stroke = "currentColor" >
        <path strokeLinecap="round" strokeLinejoin = "round" strokeWidth = { 2} d = "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            </Button>
            </div>

            < div className = "text-sm leading-relaxed text-zinc-300 font-sans" >
                {
                    snapshot.insight ? snapshot.insight.split('\n').map((line: string, i: number) => (
                        <p key= { i } className = { line.startsWith('-') ? 'ml-4 mb-1 border-l-2 border-indigo-500/30 pl-3 italic' : 'mb-3' } >
                        { line }
                        </p>
                    )) : (
                        <p className="text-zinc-500 italic" > No analysis available </p>
                    )}
</div>

{
    snapshot.data && (
        <div className="mt-6 space-y-3" >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600" > Extracted Raw Intel </div>
                < div className = "grid grid-cols-2 gap-3" >
                    {(() => {
                        try {
                            if (!snapshot.data) return null;
                            const parsed = typeof snapshot.data === 'string' ? JSON.parse(snapshot.data) : snapshot.data;
                            if (!parsed || typeof parsed !== 'object') return null;

                            return Object.entries(parsed)
                                .filter(([_, v]) => v && String(v).length < 500)
                                .map(([key, val]: [string, unknown]) => (
                                    <div key= { key } className = "rounded-xl bg-black/40 p-3 border border-zinc-800/50 transition-colors hover:bg-black/60" >
                                    <span className="block text-[9px] uppercase text-zinc-500 font-black tracking-wider mb-1" > { key } </span>
                                < span className = "text-xs text-indigo-300 font-mono break-all" > { String(val) } </span>
                                </div>
                                ));
} catch {
    return null;
}
                            }) ()}
</div>
    </div>
                      )}
</div>
    </div>
                ))}
</div>
            ) : (
    <div className= "flex h-full flex-col items-center justify-center p-12 text-center py-32" >
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800" >
        <FileText className="h-10 w-10 text-zinc-700" />
            </div>
            < h3 className = "text-xl font-bold text-zinc-300 tracking-tight" > No intelligence gathered </h3>
                < p className = "max-w-xs text-sm text-zinc-500 mt-3 leading-relaxed" >
                    The operative hasn't returned any snapshots yet. Execute a manual scan to begin the infiltration.
                        </p>
                        </div>
            )}
</div>
    </div>
    </SheetContent>
    </Sheet>
  );
}

function StatusBadge({ status }: { status: string | null }) {
    const s = status?.toLowerCase();

    if (s === "no change" || s === "success") return (
        <div className= "inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 gap-1 uppercase tracking-wider" >
        <CheckCircle2 className="h-3 w-3" /> NO CHANGE
            </div>
  );

    if (s === "minor change") return (
        <div className= "inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 gap-1 uppercase tracking-wider" >
        <AlertTriangle className="h-3 w-3" /> MINOR CHANGE
            </div>
  );

    if (s === "significant change") return (
        <div className= "inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/20 gap-1 uppercase tracking-wider" >
        <AlertTriangle className="h-3 w-3" /> SIGNIFICANT CHANGE
            </div>
  );

    if (s === "critical alert" || s === "failed" || s === "error") return (
        <div className= "inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-500 border border-red-500/20 gap-1 uppercase tracking-wider" >
        <XCircle className="h-3 w-3" /> CRITICAL ALERT
            </div>
  );

    return (
        <div className= "inline-flex items-center rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-[10px] font-bold text-zinc-400 border border-zinc-500/20 gap-1 uppercase tracking-wider" >
        <AlertTriangle className="h-3 w-3" /> { status?.toUpperCase() || 'UNKNOWN'
}
</div>
  );
}
