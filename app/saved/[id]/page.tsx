/**
 * BuildDetailPage Component
 * 
 * Displays the details of a specific saved build with options to manage it.
 * Handles viewing, sharing, and deleting individual builds.
 * 
 * Features:
 * - Displays detailed build information including all components
 * - Toggle build sharing (public/private)
 * - Copy shareable links
 * - Delete builds
 * - Responsive layout with part details
 */
'use client';

// Import necessary hooks and components
import {useEffect, useState} from 'react';  // React hooks
import {useParams, useRouter} from 'next/navigation';  // Routing utilities
import {createClient} from '@/utils/supabase/client';  // Supabase client
import {Button} from '@/components/ui/button';  // Reusable button component
import {
    Share2,
    Copy,
    Trash2,
    Loader2,
    ArrowLeft,
    UploadCloud,
    Computer,
    Clock,
    HardDrive
} from 'lucide-react';  // Icons
import {toast} from 'sonner';  // Toast notifications
import {useProfile} from '@/hooks/fetchUser';  // User profile hook
import {Switch} from '@/components/ui/switch';  // Toggle switch component
import {Label} from '@/components/ui/label';  // Form label component
import Link from "next/link";  // Client-side navigation

// Type definitions for build data structure
type BuildData = {
    name: string;  // Build name
    totalPrice?: number;  // Total price of all components
    processor?: any;  // Processor details
    memory?: any[];  // Memory components
    storage?: any[];  // Storage components
    [key: string]: any;  // Allow additional properties
};

// Type definition for a saved build
type Build = {
    id: string;  // Unique build identifier
    user_id: string;  // ID of the user who owns the build
    created_at: string;  // ISO timestamp of creation
    name: string;  // Build name
    is_shared: boolean;  // Whether the build is publicly shared
    build_data: BuildData;  // The actual build configuration
};

// Defines the order in which parts should be displayed
const partDisplayOrder = [
    'processor',
    'motherboard',
    'memory',
    'gpu',
    'cooling',
    'psu',
    'case',
    'storage'
];

export default function BuildDetailPage() {
    // Component state and hooks
    const {id} = useParams();  // Get build ID from URL
    const router = useRouter();  // Router for navigation
    const [build, setBuild] = useState<Build | null>(null);  // Current build data
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState<string | null>(null);  // Error message
    const [isDeleting, setIsDeleting] = useState(false);  // Deletion in progress
    const {profile} = useProfile();  // Current user's profile
    const supabase = createClient();  // Supabase client instance

    // Fetch build data when component mounts or when ID/profile changes
    useEffect(() => {
        const fetchBuild = async () => {
            try {
                // Query the specific build from Supabase
                const {data, error: fetchError} = await supabase
                    .from('builds')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fetchError) throw fetchError;
                if (!data) {
                    setError('Build not found');
                    return;
                }


                if (profile === undefined) {
                    return;
                }


                // Check if user has permission to view this build
                if (!data.is_shared && data.user_id !== profile?.id) {
                    setError('This build is private');
                } else {
                    setBuild(data);
                    setError(null);
                }
            } catch (err: any) {
                console.error('Error fetching build:', err);
                setError(err.message || 'Failed to load build');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            if (profile !== undefined) {
                setLoading(true);
                fetchBuild();
            } else if (profile === null && !build) {
                setLoading(true);
                fetchBuild();
            }
        } else {
            setError("Build ID is missing.");
            setLoading(false);
        }
    }, [id, profile, supabase]);

    /**
     * Toggles the sharing status of the current build
     * Updates both local state and database
     */
    const toggleShare = async () => {
        if (!profile?.id || !build) return;
        const originalSharedStatus = build.is_shared;

        // Optimistically update UI
        setBuild(prev => prev ? {...prev, is_shared: !prev.is_shared} : null);

        try {
            // Call API to update sharing status
            const response = await fetch(`/api/share-build`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({buildId: build.id})
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to update sharing');
            }

            const newIsShared = responseData.is_shared;

            // Update local state with confirmed value from server
            setBuild(prev => prev ? {...prev, is_shared: newIsShared} : null);

            // Show success message
            toast.success(
                newIsShared
                    ? 'Build is now shared publicly'
                    : 'Build is now private'
            );

            // If shared, copy the shareable link to clipboard
            if (newIsShared) {
                const url = `${window.location.origin}/saved/${build.id}`;
                if (document.hasFocus()) {
                    await navigator.clipboard.writeText(url);
                    toast.info('Share link copied to clipboard!');
                } else {
                    toast.info('Build shared. Link not copied as tab was not active.');
                }
            }
        } catch (err: any) {
            console.error('Error toggling share:', err);
            toast.error(err.message || 'Failed to update sharing');
            // Revert optimistic update on error
            setBuild(prev => prev ? {...prev, is_shared: originalSharedStatus} : null);
        }
    };

    /**
     * Copies the shareable link of the current build to clipboard
     * Shows appropriate feedback if build is not shared
     */
    const copyShareLink = () => {
        if (!build || !build.is_shared) {
            toast.error('Build is private. Share it first to get a link.');
            return;
        }
        const url = `${window.location.origin}/saved/${build.id}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    /**
     * Deletes the current build after confirmation
     * Redirects to saved builds page on success
     */
    const deleteBuild = async () => {
        if (!build) return;

        if (!confirm(`Are you sure you want to delete "${build.build_data.name || 'this build'}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            // Delete build from database
            const {error} = await supabase
                .from('builds')
                .delete()
                .eq('id', build.id)
                .eq('user_id', profile?.id);

            if (error) throw error;

            toast.success('Build deleted successfully');
            router.push('/saved');
        } catch (err) {
            console.error('Error deleting build:', err);
            toast.error('Failed to delete build');
        } finally {
            setIsDeleting(false);
        }
    };

    /**
     * Renders a part component with its details
     * @param part - The part data to render
     * @param partType - Type of the part (e.g., 'processor', 'memory')
     * @param index - Index for array parts (memory, storage)
     * @returns JSX element for the part
     */
    const renderPart = (part: any, partType: string, index: number = 0) => {
        if (!part) return null;

        // Determine the correct image path based on part type
        const imageKey = partType === 'gpu' ? 'graphic-cards' : partType;
        
        // Map part types to their URL paths
        const partTypeToUrlPath = {
            processor: 'processors',
            memory: 'memory',
            storage: 'storage',
            gpu: 'graphic-cards',
            motherboard: 'motherboards',
            psu: 'power-supplies',
            case: 'cases',
            cooling: 'cooling'
        };

        // Display name for the part type
        const displayName = {
            processor: 'Processor',
            memory: 'Memory',
            storage: 'Storage',
            gpu: 'Graphics Card',
            motherboard: 'Motherboard',
            psu: 'Power Supply',
            case: 'Case',
            cooling: 'Cooling'
        }[partType];

        // URL for the part details page
        const partDetailUrl = part.id ? `/parts/${partTypeToUrlPath[partType as keyof typeof partTypeToUrlPath]}/${part.id}` : '#';
        const isLink = !!part.id;

        // JSX for the part component
        const cardContent = (
            <div className="flex items-center p-4">
                <div className="w-16 h-16 p-2">
                    <img
                        src={`/images/icons/gradient/${partType === 'gpu' ? 'graphic-card' : partType}.png`}
                        alt={part.name || 'Part image'}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex-1 ml-4 min-w-0">
                    <div className="flex flex-col gap-2 sm:gap-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground truncate">
                                {displayName} {Array.isArray(part) && part.length > 1 ? `#${index + 1}` : ''}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold truncate">
                                {part.manufacturer} {part.name}
                            </span>
                            {part.price && (
                                <span className="text-base font-semibold whitespace-nowrap ml-4">
                                    €{typeof part.price === 'number' ? part.price.toFixed(2) : Number(part.price).toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );

        // Return a link if the part has an ID, otherwise return a plain div
        if (isLink) {
            return (
                <Link key={`${partType}-${index}`} href={partDetailUrl} className="block bg-sidebar shadow rounded-lg border mb-4 hover:shadow-md hover:border-blue-500 transition-all duration-150">
                    {cardContent}
                </Link>
            );
        }

        return (
            <div key={`${partType}-${index}`} className="bg-sidebar shadow rounded-lg border mb-4">
                {cardContent}
            </div>
        );
    };

    // Calculate total price of all parts
    const calculateTotalPrice = () => {
        if (!build?.build_data) return 0;

        let total = 0;
        Object.values(build.build_data).forEach(part => {
            if (Array.isArray(part)) {
                part.forEach(p => {
                    if (p?.price) {
                        total += typeof p.price === 'number' ? p.price : Number(p.price) || 0;
                    }
                });
            } else if (part?.price) {
                total += typeof part.price === 'number' ? part.price : Number(part.price) || 0;
            }
        });
        return total;
    };

    const totalPrice = calculateTotalPrice();

    const handleLoadBuild = () => {
        if (!build || !build.build_data) {
            toast.error("Build data is not available to load.");
            return;
        }
        try {
            // Transform the build data to match the expected structure in useBuild
            const buildToSave = {
                ...build.build_data,
                name: build.build_data.name || 'My PC Build',
                // Ensure memory and storage are arrays
                memory: Array.isArray(build.build_data.memory) ? build.build_data.memory : [],
                storage: Array.isArray(build.build_data.storage) ? build.build_data.storage : [],
            };
            
            localStorage.setItem('build', JSON.stringify(buildToSave));
            toast.success(`Build "${build.build_data.name || 'Unnamed Build'}" loaded into builder!`);
            router.push('/builder');
        } catch (e) {
            console.error("Error loading build to localStorage:", e);
            toast.error("Failed to load build into builder.");
        }
    };

    if (loading && !build) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4"/>
                <p className="text-lg text-muted-foreground">Loading build details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <Button variant="secondary" size="icon" className="size-8 mr-2">
                    <Link href="/saved">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
                <div className="text-center py-16 bg-card border rounded-lg">
                    <p className="text-destructive mb-4 text-lg">{error}</p>
                    <Button
                        onClick={() => router.push('/saved')}
                        variant="outline"
                    >
                        Go to Saved Builds
                    </Button>
                </div>
            </div>
        );
    }

    if (!build) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p>Build not found or could not be loaded.</p>
                <Button variant="secondary" size="icon" className="size-8 mr-2">
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
            </div>
        );
    }

    const isOwner = profile && profile.id === build.user_id;

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
                <Button variant="secondary" size="icon" className="size-8 mr-2">
                    <Link href="/saved">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">
                    {build.build_data.name || 'Untitled Build'}
                </h1>
            </div>


            {/* Public Build Notice */}
            {!isOwner && build.is_shared && (
                <div
                    className="mt-8 text-center bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded">
                    <p className="font-bold">Public Build</p>
                    <p>You are viewing a shared build. You can inspect its components.</p>
                </div>
            )}

            {/* Owner actions section */}
            <div className="p-4 mb-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {/* Publicly Shared Toggle */}
                    <div
                        className="flex items-center px-3 py-1 sm:px-6 text-sm justify-between border rounded-md border-neutral-600 text-primary hover:text-white  hover:bg-neutral-600 transition-colors bg-background">
                        <Label htmlFor="share-toggle" className="flex items-center cursor-pointer">
                            <Share2 className="h-3 w-3 mr-1 text-neutral-500"/>
                            Shared
                        </Label>
                        <Switch
                            id="share-toggle"
                            checked={build.is_shared}
                            onCheckedChange={toggleShare}
                            disabled={loading || isDeleting}
                            className="ml-2 scale-90"
                        />
                    </div>

                    {/* Copy Link */}
                    <Button
                        variant="outline"
                        onClick={copyShareLink}
                        disabled={!build.is_shared || loading || isDeleting}
                        className="px-3 py-1 text-sm border-blue-700 hover:text-white hover:bg-blue-700"
                    >
                        <Copy className="h-3 w-3 mr-1 text-blue-300"/>
                        Copy Link
                    </Button>

                    {/* Load Build */}
                    <Button
                        variant="outline"
                        onClick={handleLoadBuild}
                        disabled={loading || isDeleting}
                        className="px-3 py-1 text-sm border-purple-700 hover:text-white hover:bg-purple-700"
                    >
                        <UploadCloud className="h-3 w-3 mr-1 text-purple-300"/>
                        Load Build
                    </Button>

                    {/* Delete */}
                    <Button
                        variant="outline"
                        onClick={deleteBuild}
                        disabled={isDeleting || loading}
                        className="px-3 py-1 text-sm border-red-700 hover:text-white hover:bg-red-700"
                    >
                        {isDeleting ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin"/>
                        ) : (
                            <Trash2 className="h-3 w-3 mr-1 text-red-300"/>
                        )}
                        Delete
                    </Button>
                </div>
            </div>
            {/* Build metadata */}
            <h2 className="text-xl font-semibold mt-4 text-primary flex items-center justify-center">
                <Computer className="h-5 w-5 mr-2"/>
                Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-sidebar shadow border p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Computer className="h-4 w-4" />
                        <span className="text-sm">Components</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">
                        {Object.values(build.build_data).filter(Boolean).length - 1} parts
                    </p>
                </div>

                <div className="bg-sidebar shadow border p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Created</span>
                    </div>
                    <p className="text-sm mt-1">
                        {new Date(build.created_at).toLocaleDateString()}
                    </p>
                </div>

                <div className="bg-sidebar shadow border p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <HardDrive className="h-4 w-4" />
                        <span className="text-sm">Status</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${build.is_shared ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm">
                            {build.is_shared ? 'Public' : 'Private'}
                        </span>
                    </div>
                </div>
            </div>

            {/*Total Price*/}
            {totalPrice > 0 && (
                    <div className="shadow rounded-lg p-4 border mb-6 bg-sidebar">
                        <div className="flex justify-between items-center p-4">
                            <span className="text-xl">Total Price:</span>
                            <span className="text-xl font-semibold">€{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
            )}

            {/* Components section */}

            <h2 className="text-xl font-semibold mt-8 mb-2 text-primary flex items-center justify-center">
                <HardDrive className="h-5 w-5 mr-2"/>
                Components
            </h2>

            <div className="space-y-6">
                {partDisplayOrder.map(partType => {
                    const partData = build.build_data[partType];
                    if (!partData) return null;

                    if (Array.isArray(partData)) {
                        return partData.map((item, index) => renderPart(item, partType, index));
                    } else {
                        return renderPart(partData, partType);
                    }
                })}
            </div>

            {/* Informational messages for non-owners */}
            {!isOwner && !build.is_shared && (
                <div
                    className="mt-8 text-center bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300 p-4 rounded">
                    <p className="font-bold">Private Build</p>
                    <p>This build is not shared publicly by its owner.</p>
                </div>
            )}
        </div>
    );
}