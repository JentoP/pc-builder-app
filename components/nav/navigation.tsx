"use client";
import { Menu } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import Link from "next/link";

export default function Navigation() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="p-2 rounded-md">
                        <Menu className="w-5 h-5" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="flex flex-col space-y-2 p-4">
                        <Link href="/" className=" text-sm">
                            Home
                        </Link>
                        <Link href="/about" className="text-sm">
                            Getting started
                        </Link>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
