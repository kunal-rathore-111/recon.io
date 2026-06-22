"use client";

import { GithubURL } from "@/lib/urls";
import { AddReconModal } from "../add-recon-modal";
import { LongCardSheet } from "../dashboardComps/LongCardSheet";
import { ReconHistorySheet } from "../dashboardComps/ReconHistorySheet";
import { GetStartedCard } from "../dashboardComps/GetStartedCard";
import { CardComp } from "../dashboardComps/CardComp";
import { cn } from "@/lib/utils";
import { DashboardNavbar } from "../dashboard-navbar";
import { DashboardSidebar } from "../dashboard-sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { useDispatch } from "react-redux";
import { setUserEmailAndUsername } from "@/lib/store/features/userDetail/userDetailSlice";


interface recons {
    id: string;
    userId: string;
    url: string;
    title: string;
    mission: string;
    type: string;
    status: string;
    intelligenceEnabled: boolean;
    lastCheckedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export function DashboardClientComp({ recons, email, name, image, searchQuery }: {
    email: string, name: string, image: string, searchQuery: string | null, recons: recons[] | undefined,

}) {

    const dispatch = useDispatch();


    if (email && name) {
        dispatch(setUserEmailAndUsername({ email: email, name: name, image: image }))
    }


    let filteredData = recons;

    if (searchQuery && recons) {
        filteredData = recons.filter((recon) => {
            function doesContain(str: string) {
                return str.toLowerCase().includes(searchQuery as string);
            }
            return Object.values(recon).some(value => typeof value === 'string' && doesContain(value))
        })
    }


    return (
        <div className="flex min-h-dvh w-full">
            <SidebarProvider>
                <DashboardSidebar recons={filteredData ?? []} />
                <div className="flex flex-1 flex-col">
                    <DashboardNavbar />
                    <main
                        className={cn(
                            ' mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6 flex justify-center min-h-[60vh]',
                            filteredData ? 'items-start' : 'items-center',
                        )}>
                        {/* if no content then show get started card else show content in cards using CardComp */}

                        {/* if no content then show get started card else show content in cards using CardComp */}
                        {!filteredData || filteredData.length === 0 ? <GetStartedCard /> : <CardComp recons={filteredData} />}
                    </main>
                    <footer>
                        <div className="text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
                            <p className=" max-sm:text-center">
                                {`©${new Date().getFullYear()}`}{' '}
                                <a href={GithubURL} className="text-primary" target="_blank" rel="noopener noreferer">
                                    Recon.io
                                </a>{' '}
                                An Intelligence with AI
                            </p>
                        </div>
                    </footer>
                </div>

            </SidebarProvider>

            {/* add Recon card/form */}
            <AddReconModal />

            {/* detailed Recon card viewer */}
            <LongCardSheet />

            {/* Recon history timeline viewer */}
            <ReconHistorySheet />
        </div>
    );
}