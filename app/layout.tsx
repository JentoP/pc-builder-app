import {ThemeSwitcher} from "@/components/nextjs/theme-switcher";
import {Geist} from "next/font/google";
import {ThemeProvider} from "next-themes";
import Link from "next/link";
import "./globals.css";
import {SpeedInsights} from "@vercel/speed-insights/next"
import Logo from "@/components/logo";
import Navigation from "@/components/navigation";
import * as React from "react";

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

export default function RootLayout({
                                       children,
                                   }: Readonly<{
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
            <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col gap-20 items-center">
                    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                        <div className="w-full max-w-5xl flex items-center justify-between p-3 px-5 text-sm">
                            <div className="flex items-center">
                                <Link href={"/"}>
                                    <Logo/>
                                </Link>
                            </div>
                            <div className="flex items-center justify-center flex-grow">
                            </div>
                            <div className="flex items-center">
                                <ThemeSwitcher/>
                                <Navigation/>
                            </div>
                        </div>
                    </nav>

                    <div className="flex flex-col gap-20 max-w-5xl p-5">
                        {children}
                        <SpeedInsights/>
                    </div>

                    <footer
                        className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-4 py-5">
                        <p>PC Builder</p>
                        <p>© 2025</p>
                        <p>Powered by Supabase & NextJS</p>
                    </footer>
                </div>
            </main>
        </ThemeProvider>
        </body>
        </html>
    );
}
