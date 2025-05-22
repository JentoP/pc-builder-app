import {ThemeSwitcher} from "@/components/nextjs/theme-switcher";
import {Geist} from "next/font/google";
import {ThemeProvider} from "next-themes";
import "./globals.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
import Logo from "@/components/logo";
import {AppSidebar} from "@/components/nav/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import {hasEnvVars} from "@/utils/supabase/check-env-vars";
import {EnvVarWarning} from "@/components/nextjs/env-var-warning";
import HeaderAuth from "@/components/nextjs/header-auth";
import {Toaster} from 'sonner';
import BuildDrawer from "@/components/BuildDrawer";

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
                            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-12 ">
                                <div className="w-full flex items-center justify-between text-sm">
                                    <Logo/>
                                    <div className="flex items-center gap-2">
                                        <BuildDrawer/>
                                        <ThemeSwitcher/>
                                    </div>
                                </div>
                            </nav>
                        </header>

                        {/* Main Content */}
                        <div className="w-full flex-1 flex flex-col gap-20 max-w-5xl p-5">
                            {children}
                            <Toaster position="bottom-right" richColors expand/>
                            <SpeedInsights/>
                        </div>

                        {/* Footer */}
                        <footer className="w-full flex flex-col border-t mx-auto p-5">
                            <div className="text-sm flex justify-between">
                                <p>PC Builder &copy; {new Date().getFullYear()}</p>
                                <div className="flex text-end gap-4">
                                    {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
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
