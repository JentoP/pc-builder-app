"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useBuild } from '@/hooks/useBuild'
import { useProfile } from '@/hooks/fetch-user'
import { Share2 } from 'lucide-react';

export default function Saved() {
    const router = useRouter()
    const supabase = createClient()
    const [savedBuilds, setSavedBuilds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { resetBuild } = useBuild()
    const { profile, loading: profileLoading } = useProfile()

    useEffect(() => {
        const loadSavedBuilds = async () => {
            if (profileLoading) return
            
            try {
                if (!profile?.id) {
                    toast.error('You must be logged in to view saved builds')
                    router.push('/sign-in')
                    return
                }

                const { data, error } = await supabase
                    .from('builds')
                    .select('*')
                    .eq('user_id', profile.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setSavedBuilds(data || [])
            } catch (error) {
                console.error('Error loading saved builds:', error)
                toast.error('Failed to load saved builds')
            } finally {
                setLoading(false)
            }
        }


        loadSavedBuilds()
    }, [profile?.id, profileLoading, router])

    const loadBuild = async (build: any) => {
        try {
            if (!profile?.id) {
                toast.error('You must be logged in to load builds')
                return
            }

            // Reset the current build first
            resetBuild()
            
            // Gets the stored build data and ensure proper initialization
            const buildData = build.build_data
            
            // Uses a single updateBuild with the entire build data
            const initializedBuild = {
                ...buildData,
                name: buildData.name || "My PC Build",
                memory: Array.isArray(buildData.memory) ? buildData.memory : [],
                storage: Array.isArray(buildData.storage) ? buildData.storage : [],
            }
            
            // Saves all build data at once to localStorage
            localStorage.setItem('build', JSON.stringify(initializedBuild))
            
            // Redirect
            router.push('/builder')
            toast.success('Build loaded successfully')
        } catch (error) {
            console.error('Error loading build:', error)
            toast.error('Failed to load build')
        }
    }

    const shareBuild = async (build: any) => {
        try {
            const response = await fetch('/api/share-build', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    build: {
                        name: build.name,
                        processor: build.build_data.processor,
                        motherboard: build.build_data.motherboard,
                        memory: build.build_data.memory,
                        storage: build.build_data.storage,
                        cooling: build.build_data.cooling,
                        psu: build.build_data.psu,
                        case: build.build_data.case,
                        gpu: build.build_data.gpu
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to share build');
            }

            const data = await response.json();
            
            // Copy to clipboard
            await navigator.clipboard.writeText(data.url);
            toast.success('Shareable link copied to clipboard!');
            
            // Open the shared build in a new tab
            window.open(data.url, '_blank');
        } catch (error) {
            console.error('Error sharing build:', error);
            toast.error('Failed to share build');
        }
    };

    if (profileLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    if (!profile?.email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <p className="text-lg mb-4">Please sign in to view saved builds</p>
                <Button onClick={() => router.push('/sign-in')}>
                    Sign In
                </Button>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Saved Builds</h1>

            {savedBuilds.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No saved builds found</p>
                    <Button className="mt-4" onClick={() => router.push('/builder')}>
                        Start a new build
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {savedBuilds.map((build) => (
                        <div key={build.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{build.build_data.name || 'Unnamed Build'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(build.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => shareBuild(build)}
                                        className="gap-1"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                    <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={() => loadBuild(build)}
                                    >
                                        Load Build
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
