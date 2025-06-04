"use client"

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createClient} from '@/utils/supabase/client'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button'
import {useBuild} from '@/hooks/useBuild'
import {useProfile} from '@/hooks/fetch-user'
import {Clock, Cpu, HardDrive, MemoryStick, ArrowLeft, Share2, Trash2, Save} from 'lucide-react'
import Link from 'next/link'
import SignInWarning from "@/components/SignInWarning";

type SavedBuild = {
    id: string
    created_at: string
    name: string
    build_data: {
        name: string
        processor?: { name: string; manufacturer: string; price?: number }
        memory?: Array<{ name: string; size?: number; speed?: number }>
        storage?: Array<{ name: string; capacity?: number; type?: string }>
        totalPrice?: number
    }
}

export default function SavedBuildsPage() {
    const router = useRouter()
    const supabase = createClient()
    const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const {resetBuild} = useBuild()
    const {profile, loading: profileLoading, error: profileError} = useProfile()

    useEffect(() => {
        const loadSavedBuilds = async () => {
            if (profileLoading) return

            if (!profile?.id) {
                toast.error('You must be logged in to view saved builds')
                router.push('/sign-in')
                return
            }

            try {
                const {data, error} = await supabase
                    .from('builds')
                    .select('*')
                    .eq('user_id', profile.id)
                    .order('created_at', {ascending: false})

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

    const loadBuild = async (build: SavedBuild) => {
        try {
            if (!profile?.id) {
                toast.error('You must be logged in to load builds')
                router.push('/sign-in')
                return
            }

            resetBuild()

            const buildData = build.build_data
            const initializedBuild = {
                ...buildData,
                name: buildData.name || "My PC Build",
                memory: Array.isArray(buildData.memory) ? buildData.memory : [],
                storage: Array.isArray(buildData.storage) ? buildData.storage : [],
            }

            localStorage.setItem('build', JSON.stringify(initializedBuild))
            router.push('/builder')
            toast.success('Build loaded successfully')
        } catch (error) {
            console.error('Error loading build:', error)
            toast.error('Failed to load build')
        }
    }

    const deleteBuild = async (buildId: string) => {
        if (!confirm('Are you sure you want to delete this build? This action cannot be undone.')) {
            return
        }

        setDeletingId(buildId)
        try {
            const {error} = await supabase
                .from('builds')
                .delete()
                .eq('id', buildId)
                .eq('user_id', profile?.id)

            if (error) throw error

            setSavedBuilds(prev => prev.filter(build => build.id !== buildId))
            toast.success('Build deleted successfully')
        } catch (error) {
            console.error('Error deleting build:', error)
            toast.error('Failed to delete build')
        } finally {
            setDeletingId(null)
        }
    }

    const shareBuild = async (build: SavedBuild) => {
        try {
            const response = await fetch('/api/share-build', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                },
                body: JSON.stringify({
                    build: build.build_data,
                    name: build.name,
                }),
            })

            if (!response.ok) throw new Error('Failed to share build')

            const data = await response.json()
            await navigator.clipboard.writeText(data.url)
            toast.success('Shareable link copied to clipboard!')
            window.open(data.url, '_blank')
        } catch (error) {
            console.error('Error sharing build:', error)
            toast.error('Failed to share build')
        }
    }

    if (profileLoading) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4"/>
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold flex-1 text-center">Saved Builds</h1>
                    <div className="w-10"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-sidebar rounded-lg border p-6 h-64 animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (profileError || !profile?.id) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <SignInWarning/>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">Saved Builds</h1>
                <div className="w-10"></div>
            </div>

            {savedBuilds.length === 0 ? (
                <div className="text-center py-16 bg-sidebar rounded-lg border">
                    <Save className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                    <h3 className="text-lg font-medium">No saved builds yet</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                        Create and save your first PC build to get started
                    </p>
                    <Button asChild
                            className="w-fit border rounded hover:text-white text-primary bg-sidebar min-w-24 border-blue-800 hover:bg-blue-800">
                        <Link href="/builder">Start Building</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
                    {savedBuilds.map((build) => (
                        <div key={build.id} className="bg-sidebar rounded-lg border p-6 flex flex-col shadow hover:shadow-lg transition-shadow duration-200">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                                    {build.build_data.name || 'Unnamed Build'}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <Clock className="h-4 w-4"/>
                                    <span>Saved {new Date(build.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-between pt-4 border-t mt-4">
                                <Button
                                    variant="outline"
                                    className="w-fit border rounded hover:text-white text-primary bg-sidebar min-w-24 border-blue-700 hover:bg-blue-700"
                                    onClick={() => loadBuild(build)}
                                >
                                    Load Build
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-primary hover:border-blue-700 hover:text-blue-700 bg-sidebar shadow"
                                        onClick={() => shareBuild(build)}
                                    >
                                        <Share2 className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-primary hover:border-red-700 hover:text-red-700 bg-sidebar shadow"
                                        onClick={() => deleteBuild(build.id)}
                                        disabled={deletingId === build.id}
                                    >
                                        {deletingId === build.id ? (
                                            <div
                                                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                                        ) : (
                                            <Trash2 className="h-4 w-4"/>
                                        )}
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
