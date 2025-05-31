'use client'

import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {createClient} from '@/utils/supabase/client'
import {UserProfileCard} from "@/components/user/UserProfileCard";
import {useBuild} from "@/hooks/useBuild";
import {Computer, LibraryBig, User, RotateCcw, Save, Code, BookOpenCheck} from "lucide-react";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const loadUser = async () => {
            const {data: {user}, error} = await supabase.auth.getUser()
            if (!error) {
                setUser(user)
            }
        }
        loadUser()
    }, [])

    const resetBuild = useBuild().resetBuild
    return (
        <div className="p-4 mb-32 max-w-10xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-10">Dashboard</h1>
            {/* Profile Card */}
            <div className="my-4">
                {user ? (
                    <>
                        <UserProfileCard/>
                    </>
                ) : (
                    <p className="text-muted-foreground">Not logged in</p>
                )}
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-right animate-ease-in-out animate-delay-[1000ms]  animate-duration-[2000ms] ">

                {/* Current Build */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-between">
                        <Computer className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[2500ms] animate-duration-[2000ms]"/>
                        <h3 className="text-lg font-semibold mb-1">Current Build</h3>
                        <p className="text-sm text-muted-foreground mb-4">View your current configuration</p>
                        <Link href="/builder">
                            <Button
                                className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                Go to Build
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Start New Build */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-between">
                        <RotateCcw className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[3000ms] animate-duration-[2000ms]"/>
                        <h3 className="text-lg font-semibold mb-1">Start New Build</h3>
                        <p className="text-sm text-muted-foreground mb-4">Reset and begin a fresh setup</p>
                        <Link href="/builder">
                            <Button
                                onClick={resetBuild}
                                className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                Start Fresh
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Saved Builds */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-between">
                        <Save className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[3500ms] animate-duration-[2000ms]"/>
                        <h3 className="text-lg font-semibold mb-1">Saved Builds</h3>
                        <p className="text-sm text-muted-foreground mb-4">Access previously saved builds</p>
                        <Link href="/saved">
                            <Button
                                className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                View Builds
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Documentation */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-between">
                        <LibraryBig className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[4000ms] animate-duration-[2000ms]"/>
                        <h3 className="text-lg font-semibold mb-1">Documentation</h3>
                        <p className="text-sm text-muted-foreground mb-4">Read usage tips and guides</p>
                        <Link href="/tutorial">
                            <Button
                                className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                Read Docs
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Edit Profile */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-between">
                        <User className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[4500ms] animate-duration-[2000ms]"/>
                        <h3 className="text-lg font-semibold mb-1">Edit Profile</h3>
                        <p className="text-sm text-muted-foreground mb-4">Update your account details</p>
                        <Link href="/settings">
                            <Button
                                className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Developer Updates */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col items-center justify-between">
                        <Code className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[5000ms]"/>
                        <h3 className="text-lg font-semibold mb-1">Developer Updates</h3>
                        <p className="text-sm text-muted-foreground mb-4">View updates and changes</p>
                        <Link href="https://github.com/JentoP/pc-builder-app/wiki">
                            <Button
                                className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                View Updates
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-sidebar border rounded-lg my-8 p-5 shadow justify-between animate-fade-right animate-ease-in animate-delay-[5500ms] animate-duration-[3000ms]">
                <div className="flex flex-col items-center justify-between">
                    <BookOpenCheck className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[5500ms] animate-duration-[2000ms]"/>
                    <h3 className="text-lg font-semibold mb-1">Coming Soon</h3>
                    <p className="text-muted-foreground">More features are on the way</p>
                    <ul className="text-sm mt-4 text-muted-foreground text-center">
                        <li>Compare parts</li>
                        <li>Build sharing</li>
                        <li>Price tracking</li>
                        <li>Community builds</li>
                        <li>Advanced compatibility checks</li>
                        <li>Automatic fetching of new components</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
