'use client';

import {useEffect, useState} from 'react';
import {createClient} from '@/utils/supabase/client';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {ArrowLeft, Share2, Clock, Cpu, Trash2, Loader2} from 'lucide-react';
import {useProfile} from '@/hooks/fetch-user';
import {toast} from 'sonner';

type SharedBuild = {
    id: string;
    created_at: string;
    user_id?: string;
    build_data: {
        name: string;
        totalPrice?: number;
    };
};

export default function SharedBuildsPage() {
    const [builds, setBuilds] = useState<SharedBuild[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const {profile} = useProfile();
    const supabase = createClient();

    useEffect(() => {
        const fetchSharedBuilds = async () => {
            try {
                const {data, error} = await supabase
                    .from('shared_builds')
                    .select('id, created_at, user_id, build_data')
                    .order('created_at', {ascending: false});

                if (error) throw error;
                setBuilds(data || []);
            } catch (err) {
                console.error('Error fetching shared builds:', err);
                setError('Failed to load shared builds');
            } finally {
                setLoading(false);
            }
        };

        fetchSharedBuilds();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDeleteBuild = async (buildId: string, buildName: string) => {
        if (!confirm(`Are you sure you want to delete "${buildName}"?`)) {
            return;
        }

        setDeletingId(buildId);
        try {
            const {error} = await supabase
                .from('shared_builds')
                .delete()
                .eq('id', buildId);

            if (error) throw error;

            setBuilds(builds.filter(build => build.id !== buildId));
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
                    <h1 className="text-3xl font-bold flex-1 text-center">Shared Builds</h1>
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
                    <h1 className="text-3xl font-bold flex-1 text-center">Shared Builds</h1>
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
                <h1 className="text-3xl font-bold flex-1 text-center">Shared Builds</h1>
                <div className="w-10"></div>
            </div>

            {builds.length === 0 ? (
                <div className="text-center py-16 bg-sidebar rounded-lg border">
                    <Share2 className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                    <h3 className="text-lg font-medium">No shared builds yet</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                        Share your builds to see them appear here
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
                    {builds.map((build) => (
                        <div key={build.id}
                             className="bg-sidebar rounded-lg border p-6 flex flex-col shadow hover:shadow-lg transition-shadow duration-200">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold line-clamp-1 pr-2">
                                        {build.build_data.name || 'Unnamed Build'}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <Clock className="h-4 w-4"/>
                                    <span>Shared {formatDate(build.created_at)}</span>
                                </div>
                                {build.build_data.totalPrice !== undefined && (
                                    <div className="text-xl font-semibold mb-4">
                                        ${build.build_data.totalPrice.toFixed(2)}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-between pt-4 border-t mt-4">
                                <Button
                                    variant="outline"
                                    className="w-fit border rounded hover:text-white text-primary bg-sidebar min-w-24 border-blue-700 hover:bg-blue-700"
                                    asChild
                                >
                                    <Link href={`/shared/${build.id}`}>View Build</Link>
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-primary hover:border-blue-700 hover:text-blue-700 bg-sidebar shadow"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(`${window.location.origin}/shared/${build.id}`);
                                            toast.success('Link copied to clipboard!');
                                        }}
                                    >
                                        <Share2 className="h-4 w-4"/>
                                    </Button>
                                    {profile?.id === build.user_id && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-primary hover:border-red-700 hover:text-red-700 bg-sidebar shadow"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteBuild(build.id, build.build_data.name || 'this build');
                                            }}
                                            disabled={deletingId === build.id}
                                        >
                                            {deletingId === build.id ? (
                                                <div
                                                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                                            ) : (
                                                <Trash2 className="h-4 w-4"/>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
