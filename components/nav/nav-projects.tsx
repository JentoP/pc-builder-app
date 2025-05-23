"use client"

import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2,
    type LucideIcon, FolderPlus, LayoutDashboard, House,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function NavProjects({
                                projects,
                            }: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const {isMobile} = useSidebar()

    return (
        <SidebarGroup className="">
            <SidebarGroupLabel></SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <Link href="/"><House width="17" height="17"/></Link>
                        <a href="/"> <span>Home</span></a>
                    </SidebarMenuButton>
                    <SidebarMenuButton>
                        <Link href="/dashboard"><LayoutDashboard width="17" height="17"/></Link>
                        <a href="/dashboard"><span>Dashboard</span></a>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                                <item.icon/>
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal/>
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-50 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <Link href="/builder">
                                        <FolderPlus className="text-muted-foreground"/>
                                        <span>New</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/saved">
                                        <span>
                                            <Folder className="text-muted-foreground"/>
                                            View</span>
                                    </Link>
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
