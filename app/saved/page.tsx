/**
 * SavedBuildsPage Component
 *
 * Displays a list of user's saved PC builds with options to manage them.
 * Handles loading states, error states, and provides actions like sharing and deletion.
 *
 * Features:
 * - Fetches and displays user's saved builds
 * - Toggle build sharing (public/private)
 * - Delete builds
 * - Copy shareable links
 * - Responsive grid layout
 */
'use client';

// Import necessary hooks and components
import {useEffect, useState} from 'react';  // React hooks for state and side effects
import {createClient} from '@/utils/supabase/client';  // Supabase client
import {Button} from '@/components/ui/button';  // Reusable button component
import Link from 'next/link';  // Client-side navigation
import {Clock, Save, Eye, RefreshCw} from 'lucide-react';  // Icons
import {toast} from 'sonner';  // Toast notifications
import {useProfile} from '@/hooks/fetchUser';  // Hook to fetch user profile
import BackButton from '@/components/ui/BackButton';

// Type definition for a saved build
// Represents the structure of build data stored in the database
type SavedBuild = {
    id: string;  // Unique identifier for the build
    created_at: string;  // ISO timestamp of when the build was created
    name: string;  // User-defined name for the build
    is_shared: boolean;  // Whether the build is publicly accessible
    build_data: {  // The actual build configuration
        name: string;  // Duplicate of build name (for backward compatibility)
        totalPrice?: number;  // Calculated total price of all components
        processor?: any;  // Processor component details
        memory?: any[];  // Array of memory components
        storage?: any[];  // Array of storage components
    };
};

export default function SavedBuildsPage() {
    // Component state
    const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);  // List of user's saved builds
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState<string | null>(null);  // Error message
    const [deletingId, setDeletingId] = useState<string | null>(null);  // ID of build being deleted
    const {profile} = useProfile();  // Current user's profile
    const supabase = createClient();  // Supabase client instance

    // Fetch user's saved builds on component mount or when profile changes
    useEffect(() => {
        const fetchSavedBuilds = async () => {
            if (!profile?.id) {
                setLoading(false);
                return;
            }

            try {
                // Query builds from Supabase, ordered by creation date (newest first)
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

    /**
     * Formats a date string into a more readable format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date (e.g., 'Jan 1, 2023')
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    /**
     * Toggles the sharing status of a build
     * @param {SavedBuild} build - The build to update
     */
    const toggleShare = async (build: SavedBuild) => {
        try {
            // Call API to update sharing status
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

            // Update local state with new sharing status
            setSavedBuilds(prev =>
                prev.map(b =>
                    b.id === build.id ? {...b, is_shared: result.is_shared} : b
                )
            );

            // Show success message
            toast.success(
                result.is_shared
                    ? 'Build is now shared'
                    : 'Build is now private'
            );

            // If shared, copy the shareable link to clipboard
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

    /**
     * Deletes a build after confirmation
     * @param {string} buildId - ID of the build to delete
     * @param {string} buildName - Name of the build (for confirmation dialog)
     */
    const deleteBuild = async (buildId: string, buildName: string) => {
        if (!confirm(`Are you sure you want to delete "${buildName}"?`)) {
            return;
        }

        setDeletingId(buildId);
        try {
            // Delete build from Supabase
            const {error} = await supabase
                .from('builds')
                .delete()
                .eq('id', buildId)
                .eq('user_id', profile?.id);

            if (error) throw error;

            // Remove build from local state
            setSavedBuilds(prev => prev.filter(build => build.id !== buildId));
            toast.success('Build deleted successfully');
        } catch (err) {
            console.error('Error deleting build:', err);
            toast.error('Failed to delete build');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <BackButton href="/dashboard" />
                <h1 className="text-3xl font-bold flex-1 text-center">Saved Builds</h1>
                <div className="w-40" />
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-sidebar rounded-lg border p-6 h-48 animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-16 bg-sidebar rounded-lg border">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            ) : savedBuilds.length === 0 ? (
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
