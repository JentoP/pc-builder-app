"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBuild } from '@/hooks/useBuild'

export default function SavedBuildsPage() {
    const router = useRouter()
    const supabase = createClient()
    const [savedBuilds, setSavedBuilds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { resetBuild } = useBuild()

    useEffect(() => {
        const loadSavedBuilds = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError || !user) {
                    toast.error('You must be logged in to view saved builds')
                    router.push('/sign-in')
                    return
                }

                const { data, error } = await supabase
                    .from('builds')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) {
                    throw error
                }

                setSavedBuilds(data)
            } catch (error) {
                console.error('Error loading saved builds:', error)
                toast.error('Failed to load saved builds')
            } finally {
                setLoading(false)
            }
        }

        loadSavedBuilds()
    }, [router])

    const loadBuild = (build: any) => {
        resetBuild()
        router.push('/dashboard')
        toast.success('Build loaded successfully')
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-lg">Loading saved builds...</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Saved Builds</h1>

            {savedBuilds.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No saved builds found</p>
                    <Button className="mt-4" onClick={() => router.push('/builder')}>
                        Start a new build
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedBuilds.map((build, index) => (
                        <div key={index} className="bg-sidebar p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <p className="font-medium">{build.build_data.name || `Build ${index + 1}`}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-muted-foreground">
                                            Saved on {new Date(build.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => loadBuild(build)}
                                    className="hover:border-purple-700 hover:text-purple-700"
                                >
                                    Load Build
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
