'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserProfileCard } from "@/components/user/UserProfileCard"
import { useBuild } from "@/hooks/useBuild"
import { Computer, LibraryBig, User, RotateCcw, Save, Code, Share } from "lucide-react"
import SignInWarning from "@/components/SignInWarning"
import { useProfile } from "@/hooks/fetch-user"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { ComingSoon } from "@/components/dashboard/ComingSoon"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"

export default function DashboardPage() {
    const { profile, loading } = useProfile()
    const resetBuild = useBuild().resetBuild

    if (loading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="p-4 mb-32 max-w-10xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-10">Dashboard</h1>
            {profile?.email ? (
                <>
                    <div className="my-4">
                        <UserProfileCard />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DashboardCard
                            icon={Computer}
                            title="Current Build"
                            description="View your current configuration"
                            buttonText="Go to Build"
                            href="/builder"
                            buttonVariant="purple"
                        />
                        <DashboardCard
                            icon={Save}
                            title="Saved Builds"
                            description="Access previously saved builds"
                            buttonText="View Builds"
                            href="/saved"
                            buttonVariant="purple"
                        />
                        <DashboardCard
                            icon={Share}
                            title="Shared Builds"
                            description="View and manage shared builds"
                            buttonText="View Builds"
                            href="/shared"
                            buttonVariant="purple"
                        />
                        <DashboardCard
                            icon={RotateCcw}
                            title="Start New Build"
                            description="Reset and begin a fresh setup"
                            buttonText="Start Fresh"
                            href="/builder"
                            onClick={resetBuild}
                            buttonVariant="default"
                        />
                        <DashboardCard
                            icon={LibraryBig}
                            title="Documentation"
                            description="Read usage tips and guides"
                            buttonText="Read Docs"
                            href="/tutorial"
                        />
                        <DashboardCard
                            icon={User}
                            title="Edit Profile"
                            description="Update your account details"
                            buttonText="Edit Profile"
                            href="/settings"
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
