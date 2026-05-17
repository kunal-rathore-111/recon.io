"use client"

import * as React from 'react'
import {
    ArrowRightLeftIcon,
    CalendarClockIcon,
    ChartNoAxesCombinedIcon,
    ChartPieIcon,
    ChartSplineIcon,
    ClipboardListIcon,
    Clock9Icon,
    CrownIcon,
    HashIcon,
    SettingsIcon,
    SquareActivityIcon,
    Undo2Icon,
    UsersIcon
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

export function DashboardSidebar() {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Return a clean, non-mismatching static wrapper during SSR / hydration pass,
        // avoiding layout shifts on desktop while cleanly transitioning to the interactive sidebar after mounting.
        return (
            <div className='group peer hidden text-sidebar-foreground md:block' data-slot='sidebar'>
                <div className='relative w-[16rem] bg-transparent' data-slot='sidebar-gap' />
                <div className='fixed inset-y-0 z-10 left-0 hidden h-svh w-[16rem] border-r bg-sidebar md:flex' data-slot='sidebar-container'>
                    <div className='flex size-full flex-col bg-sidebar' data-sidebar='sidebar'>
                        <div className='no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto' data-sidebar='content'>
                            <div className='relative flex w-full min-w-0 flex-col p-2' data-sidebar='group'>
                                <div className='w-full text-sm' data-sidebar='group-content'>
                                    <ul className='flex w-full min-w-0 flex-col gap-0' data-sidebar='menu'>
                                        <li className='group/menu-item relative' data-sidebar='menu-item'>
                                            <div className='peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-8'>
                                                <ChartNoAxesCombinedIcon className='size-4 shrink-0' />
                                                <span className='truncate'>Recon Dashboard</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href='#'>
                                        <ChartNoAxesCombinedIcon />
                                        <span>Recon Dashboard</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

