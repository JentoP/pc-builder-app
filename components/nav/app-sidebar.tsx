"use client"

import * as React from "react"
import {
    LaptopMinimalCheck,
    BookOpen,
    PcCase,
} from "lucide-react"
import {NavMain} from "@/components/nav/nav-main"
import {NavProjects} from "@/components/nav/nav-projects"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail
} from "@/components/ui/sidebar"
import {NavUser} from "@/components/nav/nav-user"
import {useProfile} from "@/hooks/fetch-user"

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const { profile, loading } = useProfile()

    const user = {
        name: profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : "",
        email: profile.email || "",
        avatar: profile.avatarUrl || "",
    }

    const navMain = [
        {
            title: "Hardware",
            url: "#",
            icon: PcCase,
            isActive: true,
            items: [
                { title: "Processors", url: "/parts/processors" },
                { title: "Motherboards", url: "/parts/motherboards" },
                { title: "Memory", url: "/parts/memory" },
                { title: "Cooling", url: "/parts/cooling" },
                { title: "Graphic Cards", url: "/parts/graphic-cards" },
                { title: "Storage", url: "/parts/storage" },
                { title: "Power Supplies", url: "/parts/power-supplies" },
                { title: "Cases", url: "/parts/cases" },
            ],
        },
        {
            title: "Getting Started",
            url: "#",
            icon: BookOpen,
            items: [
                { title: "About", url: "/about" },
                { title: "Tutorial", url: "/tutorial" },
                { title: "Source Code", url: "https://github.com/JentoP/pc-builder-app" },
            ],
        },
    ]

    const projects = [
        {
            name: "PC Builder",
            url: "/builder",
            icon: LaptopMinimalCheck,
        },
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent>
                <NavProjects projects={projects} />
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}