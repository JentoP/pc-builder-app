import {ThemeSwitcher} from "@/components/nextjs/theme-switcher";
import {Geist} from "next/font/google";
import {ThemeProvider} from "next-themes";
import "./globals.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
import Logo from "@/components/logo";
import {AppSidebar} from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import {hasEnvVars} from "@/app/api/supabase/check-env-vars";
import {EnvVarWarning} from "@/components/nextjs/env-var-warning";
import HeaderAuth from "@/components/nextjs/header-auth";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "PC Builder web application",
    description: "The fastest way to build your own computer!",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={geistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <main className="min-h-screen flex flex-col">
                        {/* Header */}
                        <header
                            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <SidebarTrigger className="ml-3"/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-12">
                                <div className="w-full flex items-center justify-between text-sm">
                                    <Logo/>
                                    <div className="flex items-center justify-center flex-grow"/>
                                    {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}

                                </div>
                            </nav>
                        </header>


                        {/* Main Content */}
                        <div className="w-full flex-1 flex flex-col gap-20 max-w-5xl mx-12 p-5">
                            {children}
                            <SpeedInsights/>
                        </div>

                        {/* Footer */}
                        <footer className="w-full flex flex-col border-t mx-auto text-xs gap-4 p-5">
                            <div className="flex justify-between">
                                <p>PC Builder © {new Date().getFullYear()}</p>
                                <p>Powered by Supabase & NextJS</p>
                                <div className="flex text-center gap-4">
                                    <ThemeSwitcher/>
                                </div>
                            </div>
                        </footer>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
