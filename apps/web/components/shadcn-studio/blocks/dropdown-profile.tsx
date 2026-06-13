"use client"

import { useTransition, type ReactNode } from 'react'

import {
  LogOutIcon
} from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOutAction } from '@/app/actions/auth'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
}

const ProfileDropdown = ({ trigger, defaultOpen, align = 'end' }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { email, userFullName } = useSelector((state: RootState) => state.userDetails)

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align={align || 'end'}>
        <DropdownMenuLabel className='flex items-center gap-4 px-4 py-2.5 font-normal'>
          <div className='relative'>
            <Avatar className='size-10'>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' alt={userFullName} />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
          </div>
          <div className='flex flex-1 flex-col items-start'>
            <span className='text-foreground text-lg font-semibold'>{userFullName}</span>
            <span className='text-muted-foreground text-base'>{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant='destructive'
          disabled={isPending}
          className='px-4 py-2.5 text-sm'
          onClick={() => startTransition(async () => {
            await signOutAction()
          })}>
          <LogOutIcon className='size-4' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown;
