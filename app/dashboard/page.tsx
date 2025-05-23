'use client'

import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {createClient} from '@/utils/supabase/client'
import {UserProfileCard} from "@/components/user/UserProfileCard";
import {FunFactCardList} from "@/components/FunFactsCard";
import {useBuild} from "@/hooks/useBuild";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const loadUser = async () => {
            const {data: {user}, error} = await supabase.auth.getUser()
            if (!error) {
                setUser(user)
            }
            setLoading(false)
        }
        loadUser()
    }, [])

    const resetBuild = useBuild().resetBuild
    return (
        <div className="p-4 mb-32">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="font-semibold text-l mb-6">Welcome</p>
            {/* Profile Card */}
            <div className="my-4">
                {loading ? (
                    <div>
                        <Skeleton className="h-6 w-2/3 mb-2"/>
                        <Skeleton className="h-4 w-1/3"/>
                    </div>
                ) : user ? (
                    <>
                        <p className="text-l text-muted-foreground mb-1">Logged in as:</p>
                        <UserProfileCard/>
                    </>
                ) : (
                    <p className="text-muted-foreground">Not logged in</p>
                )}
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Current Build */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    {loading ? (
                        <>
                            <Skeleton className="h-6 w-3/4 mb-2"/>
                            <Skeleton className="h-4 w-full mb-4"/>
                            <Skeleton className="h-10 w-1/2"/>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Current Build</h3>
                                <p className="text-sm text-muted-foreground mb-4">View your current configuration</p>
                            </div>
                            <Link href="/builder">
                                <Button
                                    className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                    Go to Build
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Start New Build */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    {loading ? (
                        <>
                            <Skeleton className="h-6 w-3/4 mb-2"/>
                            <Skeleton className="h-4 w-full mb-4"/>
                            <Skeleton className="h-10 w-1/2"/>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Start New Build</h3>
                                <p className="text-sm text-muted-foreground mb-4">Reset and begin a fresh setup</p>
                            </div>
                            <Link href="/builder">
                                <Button
                                    onClick={resetBuild}
                                    className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                    Start Fresh
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Saved Builds */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    {loading ? (
                        <>
                            <Skeleton className="h-6 w-3/4 mb-2"/>
                            <Skeleton className="h-4 w-full mb-4"/>
                            <Skeleton className="h-10 w-1/2"/>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Saved Builds</h3>
                                <p className="text-sm text-muted-foreground mb-4">Access previously saved builds</p>
                            </div>
                            <Link href="/saved">
                                <Button
                                    className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                    View Saves
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Documentation */}
                <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    {loading ? (
                        <>
                            <Skeleton className="h-6 w-3/4 mb-2"/>
                            <Skeleton className="h-4 w-full mb-4"/>
                            <Skeleton className="h-10 w-1/2"/>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Documentation</h3>
                                <p className="text-sm text-muted-foreground mb-4">Read usage tips and guides</p>
                            </div>
                            <Link href="/docs">
                                <Button
                                    className="w-fit bg-accent hover:bg-accent border border-blue-600 hover:border-purple-700 text-primary">
                                    Read Docs
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
            {/* Fun Facts */}
            <div className="bg-sidebar border rounded-lg my-8 p-5 shadow-sm flex flex-row justify-between">
                {loading ? (
                    <>
                        <Skeleton className="h-6 w-3/4 mb-2"/>
                        <Skeleton className="h-10 w-1/2"/>
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-1">Fun Facts</h3>
                        {/*<FunFactsCardList/>*/}
                    </>
                )}
            </div>
        </div>
    )
}
