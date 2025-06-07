'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {createClient} from '@/utils/supabase/client';
import {Button} from '@/components/ui/button';
import {
    Share2,
    Copy,
    Trash2,
    Loader2,
    ArrowLeft,
    Settings2,
    UploadCloud,
    EyeIcon,
    Computer,
    Clock,
    HardDrive
} from 'lucide-react';
import {toast} from 'sonner';
import {useProfile} from '@/hooks/fetch-user';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import Link from "next/link";

type BuildData = {
    name: string;
    totalPrice?: number;
    processor?: any;
    memory?: any[];
    storage?: any[];
    [key: string]: any;
};

type Build = {
    id: string;
    user_id: string;
    created_at: string;
    name: string;
    is_shared: boolean;
    build_data: BuildData;
};

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
    const {id} = useParams();
    const router = useRouter();
    const [build, setBuild] = useState<Build | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const {profile} = useProfile();
    const supabase = createClient();

    useEffect(() => {
        const fetchBuild = async () => {
            try {
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

    const toggleShare = async () => {
        if (!profile?.id || !build) return;
        const originalSharedStatus = build.is_shared;

        setBuild(prev => prev ? {...prev, is_shared: !prev.is_shared} : null);

        try {
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

            setBuild(prev => prev ? {...prev, is_shared: newIsShared} : null);

            toast.success(
                newIsShared
                    ? 'Build is now shared publicly'
                    : 'Build is now private'
            );

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
            setBuild(prev => prev ? {...prev, is_shared: originalSharedStatus} : null);
        }
    };

    const copyShareLink = () => {
        if (!build || !build.is_shared) {
            toast.error('Build is private. Share it first to get a link.');
            return;
        }
        const url = `${window.location.origin}/saved/${build.id}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    const deleteBuild = async () => {
        if (!build) return;

        if (!confirm(`Are you sure you want to delete "${build.build_data.name || 'this build'}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
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

    const renderPart = (part: any, partType: string, index: number = 0) => {
        if (!part) return null;

        const imageKey = partType === 'gpu' ? 'graphic-cards' : partType;
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

        const partDetailUrl = part.id ? `/parts/${partTypeToUrlPath[partType as keyof typeof partTypeToUrlPath]}/${part.id}` : '#';
        const isLink = !!part.id;

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
                <Button variant="outline" size="icon" asChild>
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
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
            </div>
        );
    }

    const isOwner = profile && profile.id === build.user_id;

    const handleLoadBuild = () => {
        if (!build || !build.build_data) {
            toast.error("Build data is not available to load.");
            return;
        }
        try {
            localStorage.setItem('currentBuild', JSON.stringify(build.build_data));
            toast.success(`Build "${build.build_data.name || 'Unnamed Build'}" loaded into builder!`);
            router.push('/builder');
        } catch (e) {
            console.error("Error loading build to localStorage:", e);
            toast.error("Failed to load build into builder.");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/saved">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">
                    {build.build_data.name || 'Untitled Build'}
                </h1>
            </div>


            {/* Owner actions section */}
            <h2 className="text-xl font-semibold mt-8 mb-2 text-primary flex items-center justify-center">
                <Settings2 className="h-5 w-5 mr-2"/>
                Actions
            </h2>
            <div className="shadow rounded-lg p-4 border mb-6 bg-sidebar">
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


            {/* Public Build Notice */}
            {!isOwner && build.is_shared && (
                <div
                    className="mt-8 text-center bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded">
                    <p className="font-bold">Public Build</p>
                    <p>You are viewing a shared build. You can inspect its components.</p>
                </div>
            )}


            {totalPrice > 0 && (
                <>
                    <h2 className="text-xl font-semibold mt-8 mb-2 text-primary flex items-center justify-center">
                        <Computer className="h-5 w-5 mr-2"/>
                        Summary
                    </h2>
                    <div className="shadow rounded-lg p-4 border mb-6 bg-sidebar">
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4"/>
                                    <span>Created on {new Date(build.created_at).toLocaleDateString()}</span>
                                </div>
                                {build.is_shared ? (
                                    <span
                                        className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Shared</span>
                                ) : (
                                    <span
                                        className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Private</span>
                                )}
                            </div>

                            <div>Total parts: <strong>{Object.keys(build.build_data).length}</strong></div>
                            <div>Assembled by: <strong>{profile?.firstName || 'Unknown'}</strong></div>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4 mt-4">
                            <span className="text-xl">Total Price:</span>
                            <span className="text-xl font-semibold">€{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </>
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