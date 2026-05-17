
"use client"

import { Plus } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'
import { setAddReconReducer } from '@/lib/store/features/addRecon/addReconSlice'
import { useDispatch } from 'react-redux'

export function DashboardNavbar() {
    const dispatch = useDispatch();
    return (
        <header className='bg-card sticky top-0 z-50 border-b'>
            <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6'>
                <div className='flex items-center gap-4'>
                    <SidebarTrigger className='[&_svg]:!size-5' />
                    <Separator orientation='vertical' className='hidden !h-4 sm:block' />
                    <Breadcrumb className='hidden sm:block'>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>
                                <BreadcrumbLink >Dashboard</BreadcrumbLink>
                            </BreadcrumbPage>

                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className='flex items-center gap-4 justify-center'>
                    <button className='bg-zinc-800 text-white p-2 rounded text-sm flex items-center gap-0.5 dark:text-black dark:bg-zinc-300'
                        onClick={() => dispatch(setAddReconReducer())}>
                        Add Recon <Plus size={15} className='inline-block' />
                    </button>
                    <div className='flex items-center p-2 bg-black/10 rounded-md dark:bg-zinc-300 dark:text-black'>
                        <AnimatedThemeToggler />
                    </div>
                    <ProfileDropdown
                        trigger={
                            <Button variant='ghost' size='icon' className='size-9.5'>
                                <Avatar className='size-9.5 rounded-md'>
                                    <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                            </Button>
                        }
                    />


                </div>
            </div>
        </header>
    )
}
