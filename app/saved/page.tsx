'use client';

import {useEffect, useState} from 'react';
import {createClient} from '@/utils/supabase/client';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch'; // ✅ Import the Switch
import Link from 'next/link';
import {ArrowLeft, Clock, Trash2, Loader2, Save, Eye} from 'lucide-react';
import {toast} from 'sonner';
import {useProfile} from '@/hooks/fetchUser';

type SavedBuild = {
    id: string;
    created_at: string;
    name: string;
    is_shared: boolean;
    build_data: {
        name: string;
        totalPrice?: number;
        processor?: any;
        memory?: any[];
        storage?: any[];
    };
};

export default function SavedBuildsPage() {
    const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const {profile} = useProfile();
    const supabase = createClient();

    useEffect(() => {
        const fetchSavedBuilds = async () => {
            if (!profile?.id) {
                setLoading(false);
                return;
            }

            try {
                const {data, error} = await supabase
                    .from('builds')
                    .select('*')
                    .eq('user_id', profile.id)
                    .order('created_at', {ascending: false});

                if (error) throw error;
                setSavedBuilds(data || []);
            } catch (err) {
                console.error('Error fetching saved builds:', err);
                setError('Failed to load saved builds');
            } finally {
                setLoading(false);
            }
        };

        fetchSavedBuilds();
    }, [profile?.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const toggleShare = async (build: SavedBuild) => {
        try {
            const response = await fetch('/api/share-build', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for session cookies
                body: JSON.stringify({buildId: build.id}),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update share status');
            }

            setSavedBuilds(prev =>
                prev.map(b =>
                    b.id === build.id ? {...b, is_shared: result.is_shared} : b
                )
            );

            toast.success(
                result.is_shared
                    ? 'Build is now shared'
                    : 'Build is now private'
            );

            if (result.is_shared) {
                const url = `${window.location.origin}/saved/${build.id}`;
                await navigator.clipboard.writeText(url);
                toast.success('Share link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error toggling share:', err);
            toast.error('Failed to update share status');
        }
    };

    const deleteBuild = async (buildId: string, buildName: string) => {
        if (!confirm(`Are you sure you want to delete "${buildName}"?`)) {
            return;
        }

        setDeletingId(buildId);
        try {
            const {error} = await supabase
                .from('builds')
                .delete()
                .eq('id', buildId)
                .eq('user_id', profile?.id);

            if (error) throw error;

            setSavedBuilds(prev => prev.filter(build => build.id !== buildId));
            toast.success('Build deleted successfully');
        } catch (err) {
            console.error('Error deleting build:', err);
            toast.error('Failed to delete build');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
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
                        <div key={i} className="bg-sidebar rounded-lg border p-6 h-48 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
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
                <div className="text-center py-16 bg-sidebar rounded-lg border">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-fit border rounded hover:text-white text-primary bg-sidebar min-w-24 border-blue-800 hover:bg-blue-800"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
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
                        Create and save your first PC build
                    </p>
                    <Button
                        asChild
                        className="w-fit border rounded hover:text-white text-primary bg-sidebar min-w-24 border-blue-800 hover:bg-blue-800"
                    >
                        <Link href="/builder">Start Building</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {savedBuilds.map((build) => (
                        <div
                            key={build.id}
                            className="bg-sidebar rounded-lg border p-6 flex flex-col shadow hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex-1">
                                <div className="flex justify-center items-start mb-2">
                                    <h3 className="text-lg font-semibold line-clamp-1 pr-2">
                                        {build.build_data.name || 'Unnamed Build'}
                                    </h3>
                                </div>
                                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4"/>
                                    <span>Saved {formatDate(build.created_at)}</span>
                                    {build.is_shared && (
                                        <span
                                            className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Shared
                    </span>
                                    )}
                                </div>
                                {build.build_data.totalPrice !== undefined && (
                                    <div className="text-xl font-semibold mb-4">
                                        ${build.build_data.totalPrice.toFixed(2)}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center mt-4 items-center mx-8">
                                <Button
                                    variant="outline"
                                    className="w-full border rounded hover:text-white text-primary bg-sidebar min-w-24 border-blue-700 hover:bg-blue-700"
                                    asChild
                                >
                                    <Link href={`/saved/${build.id}`}>
                                        <Eye className="h-4 w-4"/>
                                        View Build
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
