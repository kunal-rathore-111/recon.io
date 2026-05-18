
"use client"

import { ChartNoAxesCombinedIcon } from "lucide-react";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAddReconReducer } from "@/lib/store/features/addRecon/addReconSlice";

export function GetStartedCard() {
    const dispatch = useDispatch();

    return <div className='flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-xl max-w-lg bg-card/50 backdrop-blur-sm shadow-sm'>
        <div className='bg-primary/10 text-primary p-4 rounded-full mb-4 animate-pulse'>
            <ChartNoAxesCombinedIcon className='size-8' />
        </div>
        <h2 className='text-2xl font-bold tracking-tight mb-2'>Recon Workspace Ready</h2>
        <p className='text-muted-foreground text-sm mb-6'>
            Your dashboard is set up. You can now start adding targets to scan.
        </p>
        <div className='flex gap-3'>
            <Button size='sm' onClick={() => dispatch(setAddReconReducer())}>Add your First Target</Button>
            <Button size='sm' variant='outline'
                onClick={() => redirect('/')}>Go Home</Button>
        </div>
    </div>
}