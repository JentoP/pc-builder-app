"use client"

import {
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/fetchUser"
import { createClient } from "@/utils/supabase/client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function NavUser() {
    const { profile, loading } = useProfile()
    const { isMobile } = useSidebar()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            window.location.href = '/'
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        )
    }

    const fullName = `${profile.firstName} ${profile.lastName}`.trim()
    const initials = (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '')

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {profile.avatarUrl && (
                                    <AvatarImage src={profile.avatarUrl} alt={fullName} />
                                )}
                                <AvatarFallback className="rounded-lg">
                                    {initials || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {fullName || 'User'}
                                </span>
                                <span className="truncate text-xs">{profile.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-16 w-16 rounded-lg">
                                    {profile.avatarUrl && (
                                        <AvatarImage src={profile.avatarUrl} alt={fullName} />
                                    )}
                                    <AvatarFallback className="rounded-lg">
                                        {initials || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {fullName || 'User'}
                                    </span>
                                    <span className="truncate text-xs">{profile.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <a href="/settings">
                                <DropdownMenuItem>
                                    <BadgeCheck className="mr-2 h-4 w-4" />
                                    Account
                                </DropdownMenuItem>
                            </a>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={handleLogout} 
                            className="cursor-pointer text-primary hover:bg-red-50 hover:text-purple-700"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
