"use client"

import * as React from 'react'
import {
    Blocks,
    ChartNoAxesCombinedIcon,
    ChevronDown,
    Globe2,
    LucideHome,
    LucideIcon,
    Newspaper,
    PlugZap,
    ShoppingBag,
} from 'lucide-react'



import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
} from '@/components/ui/sidebar'
import { reconDataResponseType } from '@/app/actions/getRecons'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useDispatch } from 'react-redux'
import { setLongSelectedCard } from '@/lib/store/features/ui/uiSlice'
import { trimString } from './dashboardComps/CardComp'
import { CollapsibleContent, Collapsible, CollapsibleTrigger } from './ui/collapsible'
import { Button } from './ui/button'

interface DashboardSidebarProps {
    recons: reconDataResponseType[];
}


export function DashboardSidebar({ recons }: DashboardSidebarProps) {
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

    const reconsByType = {
        ecommerce: [] as typeof recons,
        saas: [] as typeof recons,
        blog: [] as typeof recons,
        api: [] as typeof recons,
        custom: [] as typeof recons,
    }
    // now push based on type

    recons.forEach((recon) => {
        const typeKey = recon.type as keyof typeof reconsByType;
        if (typeKey in reconsByType) reconsByType[typeKey].push(recon);
        // if key is something else than 5 then push as custom
        else reconsByType['custom'].push(recon);
    })


    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarHeader >

                                <div className='flex justify-between  items-center'>
                                    <SidebarMenuButton asChild
                                        onClick={() => scrollTo({ top: 0, behavior: "smooth" })} className='cursor-pointer'>
                                        <span>
                                            <ChartNoAxesCombinedIcon />
                                            <span>Recon Dashboard</span>
                                        </span>
                                    </SidebarMenuButton>
                                    <SidebarMenuButton className='w-fit'
                                        asChild >
                                        <Link href={'/'}>
                                            <LucideHome />
                                        </Link>
                                    </SidebarMenuButton>
                                </div>
                            </SidebarHeader>
                            <hr />
                            <SidebarContent className='pl-4 mt-5 space-y-3' >

                                <RenderTypesDropDownComp reconsByType={reconsByType} type='ecommerce' Icon={ShoppingBag} />
                                <RenderTypesDropDownComp reconsByType={reconsByType} type='saas' Icon={Blocks} />
                                <RenderTypesDropDownComp reconsByType={reconsByType} type='api' Icon={PlugZap} />
                                <RenderTypesDropDownComp reconsByType={reconsByType} type='blog' Icon={Newspaper} />
                                <RenderTypesDropDownComp reconsByType={reconsByType} type='custom' Icon={Globe2} />
                            </SidebarContent>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar >
    )
}




interface reconsByTypeInterface {
    ecommerce: reconDataResponseType[];
    saas: reconDataResponseType[];
    blog: reconDataResponseType[];
    api: reconDataResponseType[];
    custom: reconDataResponseType[];
}
interface RenderTypesDropDownComp {
    type: "ecommerce" | "saas" | "blog" | "api" | "custom",
    reconsByType: reconsByTypeInterface,
    Icon: LucideIcon
}




function RenderTypesDropDownComp({ reconsByType, type, Icon }: RenderTypesDropDownComp) {

    const dispatch = useDispatch();

    return <Collapsible >
        <CollapsibleTrigger asChild >
            <Button variant={"link"} className="hover:no-underline group w-full justify-start transition-colors duration-200 bg-zinc-200 rounded-sm  capitalize dark:text-black dark:bg-zinc-300 dark:hover:bg-black/10 dark:hover:border dark:hover:border-white hover:text-white dark:hover:text-white hover:bg-black"
            >
                <Icon size={16} /> {type}
                <ChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
            </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className='m-2 rounded-sm border text-xs'>
            {
                reconsByType[type].length > 0 ?
                    reconsByType[type].map((recon, idx) => {
                        const TrimmedTitle = trimString(recon.title)
                        return <div
                            key={recon.id}
                            className='py-1 cursor-pointer border-b hover:text-white hover:bg-black dark:hover:bg-zinc-100/80 dark:hover:text-black rounded-sm  px-3' onClick={() => dispatch(setLongSelectedCard(recon))}>
                            {idx + 1}.   {TrimmedTitle}
                        </div>
                    }) :
                    <div className='p-1'>
                        No content Available
                    </div>
            }
        </CollapsibleContent>
    </Collapsible >
}
