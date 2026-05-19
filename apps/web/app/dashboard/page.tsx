
"use server"

import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardNavbar } from '@/components/dashboard-navbar'
import { GetStartedCard } from '@/components/dashboardComps/GetStartedCard'
import { AddReconModal } from '@/components/add-recon-modal'
import { getReconsAction, } from '../actions/getRecons'
import { ToastComp } from '@/components/toastComp'
import { CardComp } from '@/components/dashboardComps/CardComp'
import { LongCardSheet } from '@/components/dashboardComps/LongCardSheet'
import { ReconHistorySheet } from '@/components/dashboardComps/ReconHistorySheet'
import { cn } from '@/lib/utils'




export default async function Dashboard() {

    const response = await getReconsAction();
    const recons = response.data ?? [];

    return (
        <div className='flex min-h-dvh w-full'>
            <SidebarProvider >
                <DashboardSidebar recons={recons} />
                <div className='flex flex-1 flex-col'>
                    <DashboardNavbar />
                    <main className={cn(' mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6 flex justify-center min-h-[60vh]', recons ? 'items-start' : 'items-center')} >

                        {/* if error in response then show using ToastComp */}
                        {
                            response.error && <ToastComp type="error" message={response.error} />
                        }

                        {/* if no content then show get started card else show content in cards using CardComp */}
                        {!recons || recons.length === 0 ? <GetStartedCard /> :
                            <CardComp recons={recons} />}

                    </main>
                    <footer>
                        <div className='text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6'>
                            <p className=' max-sm:text-center'>
                                {`©${new Date().getFullYear()}`}{' '}
                                <a href='#' className='text-primary'>
                                    Recon.io
                                </a>{" "}
                                An Intelligence with AI
                            </p>
                        </div>
                    </footer>
                </div>
            </SidebarProvider >

            {/* add Recon card/form */}
            < AddReconModal />

            {/* detailed Recon card viewer */}
            < LongCardSheet />

            {/* Recon history timeline viewer */}
            <ReconHistorySheet />
        </div >
    )
}

