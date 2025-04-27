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
                        <House className="text-muted-foreground"/>
                        <a href="/"> <span>Home</span></a>
                    </SidebarMenuButton>
                    <SidebarMenuButton>
                        <LayoutDashboard className="text-muted-foreground"/>
                        <a href="/dashboard"> <span>Dashboard</span></a>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon/>
                                <span>{item.name}</span>
                            </a>
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
                                    <Link href="/builder/projects/new">
                                        <FolderPlus className="text-muted-foreground"/>
                                        <span>New Project</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/builder/projects">
                                        <Folder className="text-muted-foreground"/>
                                        <span>View Projects</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/builder/projects/shared">
                                        <Forward className="text-muted-foreground"/>
                                        <span>Shared Projects</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>
                                    <Link href="/builder/projects/deleted">
                                        <Trash2 className="text-muted-foreground"/>
                                        <span>Deleted Projects</span>
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
