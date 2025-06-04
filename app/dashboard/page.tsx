'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserProfileCard } from "@/components/user/UserProfileCard"
import { useBuild } from "@/hooks/useBuild"
import { Computer, LibraryBig, User, RotateCcw, Save, Code } from "lucide-react"
import SignInWarning from "@/components/SignInWarning"
import { useProfile } from "@/hooks/fetch-user"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { ComingSoon } from "@/components/dashboard/ComingSoon"

export default function DashboardPage() {
    const { profile, loading } = useProfile()
    const resetBuild = useBuild().resetBuild

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    return (
        <div className="p-4 mb-32 max-w-10xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-10">Dashboard</h1>
            {profile?.email ? (
                <>
                    <div className="my-4">
                        <UserProfileCard />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-right animate-ease-in-out animate-delay-[1000ms] animate-duration-[2000ms]">
                        <DashboardCard
                            icon={Computer}
                            title="Current Build"
                            description="View your current configuration"
                            buttonText="Go to Build"
                            href="/builder"
                            buttonVariant="purple"
                            animationDelay="2500ms"
                        />

                        <DashboardCard
                            icon={RotateCcw}
                            title="Start New Build"
                            description="Reset and begin a fresh setup"
                            buttonText="Start Fresh"
                            href="/builder"
                            onClick={resetBuild}
                            buttonVariant="purple"
                            animationDelay="3000ms"
                        />

                        <DashboardCard
                            icon={Save}
                            title="Saved Builds"
                            description="Access previously saved builds"
                            buttonText="View Builds"
                            href="/saved"
                            buttonVariant="purple"
                            animationDelay="3500ms"
                        />

                        <DashboardCard
                            icon={LibraryBig}
                            title="Documentation"
                            description="Read usage tips and guides"
                            buttonText="Read Docs"
                            href="/tutorial"
                            animationDelay="4000ms"
                        />

                        <DashboardCard
                            icon={User}
                            title="Edit Profile"
                            description="Update your account details"
                            buttonText="Edit Profile"
                            href="/settings"
                            animationDelay="4500ms"
                        />

                        <DashboardCard
                            icon={Code}
                            title="Developer Updates"
                            description="View updates and changes"
                            buttonText="View Updates"
                            href="https://github.com/JentoP/pc-builder-app/wiki"
                            external
                            animationDelay="5000ms"
                        />
                    </div>

                    <ComingSoon />
                </>
            ) : (
                <SignInWarning />
            )}
        </div>
    )
}
