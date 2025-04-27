"use client"

import * as React from "react"
import {
    LaptopMinimalCheck,
    BookOpen,
    PcCase,
    Map,
    PieChart,
    Settings2,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link";
import Logo from "@/components/logo";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Hardware Components",
            url: "#",
            icon: PcCase,
            isActive: true,
            items: [
                {
                    title: "Processors",
                    url: "/processors",
                }, {
                    title: "Motherboards",
                    url: "/motherboards",
                }, {
                    title: "Memory",
                    url: "/memory",
                }, {
                    title: "Graphic Cards",
                    url: "/graphic-cards",
                }, {
                    title: "Storage",
                    url: "/storage",
                }, {
                    title: "Power Supplies",
                    url: "/power-supplies",
                }, {
                    title: "Cases",
                    url: "/cases",
                }, {
                    title: "Cooling",
                    url: "/cooling",
                },
            ],
        },
        {
            title: "Getting Started",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "About",
                    url: "/about",
                },
                {
                    title: "Tutorial",
                    url: "/tutorial",
                },
                {
                    title: "Changelog",
                    url: "/logs",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "/settings",
                },
                {
                    title: "Billing",
                    url: "/billing",
                },
            ],
        },
    ],
    projects: [
        {
            name: "PC Builder",
            url: "/builder",
            icon: LaptopMinimalCheck,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent>
                <NavProjects projects={data.projects}/>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
