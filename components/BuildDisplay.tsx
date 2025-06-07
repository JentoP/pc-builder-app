'use client'

import {useBuild} from '@/hooks/useBuild'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {createClient} from '@/utils/supabase/client'
import {toast} from 'sonner'
import {useEffect, useState} from 'react'
import SignInWarning from "@/components/SignInWarning";
import {useRouter} from 'next/navigation'
import {getNextPartType} from '@/utils/compatibility'
import {Blocks} from "lucide-react";
import {Input} from "@/components/ui/input";
import { useProfile } from "@/hooks/fetch-user"
import { Share2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const partKeys: string[] = [
    'processor', 'motherboard', 'cooling', 'gpu', 'psu', 'case',
];

const partRoutes: Record<string, string> = {
    processor: 'parts/processors',
    motherboard: 'parts/motherboards',
    memory: 'parts/memory',
    storage: 'parts/storage',
    cooling: 'parts/cooling',
    psu: 'parts/power-supplies',
    case: 'parts/cases',
    gpu: 'parts/graphic-cards',
}

const displayNames: Record<string, string> = {
    processor: 'Processor',
    motherboard: 'Motherboard',
    memory: 'Memory',
    storage: 'Storage',
    cooling: 'Cooling',
    psu: 'Power Supply',
    case: 'Case',
    gpu: 'Graphic Card',
}

export default function BuildDisplay() {
    const {build, clearPart, resetBuild, updatePart} = useBuild();
    const router = useRouter();
    const { profile, loading } = useProfile();
    const [buildName, setBuildName] = useState(build.name);
    const supabase = createClient();
    const [localIsSharedPreference, setLocalIsSharedPreference] = useState<boolean>(false);

    useEffect(() => {
        setBuildName(build.name || "My PC Build");
    }, [build.name]);

    if (loading) {
        return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div></div>;
    }

    if (!profile?.email) {
        return <SignInWarning/>;
    }

    const saveBuild = async () => {
        if (!profile?.email) {
            toast.warning("You must be logged in to save a build.");
            return;
        }

        const {error} = await supabase.from('builds').insert([
            {
                user_id: profile.id,
                build_data: {
                    ...build,
                    name: buildName
                },
                is_shared: localIsSharedPreference,
            },
        ]);

        if (error) {
            toast.error("Failed to save build.");
        } else {
            toast.success("Build saved successfully!");
            router.push('/saved');
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuildName(e.target.value);
        updatePart('name', e.target.value);
    }

    const totalPrice =
        (Array.isArray(build.memory)
            ? build.memory.reduce((sum, m) => sum + (m?.price || 0), 0)
            : 0)
        +
        (Array.isArray(build.storage)
            ? build.storage.reduce((sum, s) => sum + (s?.price || 0), 0)
            : 0)
        +
        partKeys.reduce((sum, key) => {
            const part = build[key as keyof typeof build];
            return sum + (part?.price || 0);
        }, 0);

    const setPrimaryStorage = (index: number) => {
        if (!Array.isArray(build.storage)) return;
        const updated = [...build.storage];
        const [primary] = updated.splice(index, 1);
        updated.unshift(primary);
        updatePart('storage', updated);
    }

    const handleSelectClick = (e: React.MouseEvent, route: string) => {
        e.preventDefault();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        setTimeout(() => {
            window.location.href = `/${route}`;
        }, 100);
    };

    const renderPart = (key: string) => {
        const part = build[key as keyof typeof build];
        const route = partRoutes[key];
        const displayName = displayNames[key] || key;

        const imageKey = key === 'gpu' ? 'graphic-card' : key;
        const imageUrl = part?.image_url || `/images/icons/gradient/${imageKey}.png`;

        return (
            <div key={key}
                 className="flex items-center gap-4 border rounded py-2 px-2 m-1 shadow-border shadow-sm bg-sidebar">
                <img src={imageUrl} alt={part?.name || displayName} className="w-16 h-16 object-contain rounded"/>
                <div className="flex-1">
                    <p className="font-semibold">{displayName}</p>
                    {part ? (
                        <>
                            <p>{part.manufacturer} {part.name}</p>
                            <p className="text-sm text-muted-foreground">€ {part.price ? part.price.toFixed(2) : '0.00'}</p>
                        </>
                    ) : (
                        <p className="text-muted-foreground">No part selected</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    {part ? (
                        <>
                            <Link href={`/${route}`}>
                                <Button variant="outline" size="sm" onClick={(e) => handleSelectClick(e, route)}
                                        className="min-w-20 hover:border-purple-600">Select</Button>
                            </Link>
                            <Link href={`/${route}/${part.id}`}>
                                <Button variant="outline" size="sm"
                                        className="min-w-20 hover:border-blue-600">View</Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => clearPart(key)}
                                    className="min-w-20 hover:border-red-600">Remove</Button>
                        </>
                    ) : (
                        <Link href={`/${route}`}>
                            <Button variant="outline" size="sm" onClick={(e) => handleSelectClick(e, route)}
                                    className="min-w-20 hover:border-purple-600">Select</Button>
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    const renderMemory = () => {
        if (Array.isArray(build.memory) && build.memory.length > 0) {
            return build.memory.map((ram, index) => (
                <div key={index}
                     className="flex items-center gap-4 border rounded py-2 px-2 m-1 shadow-border shadow-sm bg-sidebar">
                    <img src={ram?.image_url || '/images/icons/gradient/memory.png'} alt={ram?.name || 'RAM'}
                         className="w-16 h-16 object-contain rounded"/>
                    <div className="flex-1">
                        <p className="font-semibold">Memory Module {index + 1}</p>
                        <p>{ram.manufacturer} {ram.name}</p>
                        <p className="text-sm text-muted-foreground">€ {ram.price?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Link href={`/parts/memory`}>
                            <Button variant="outline" size="sm"
                                    className="min-w-20 hover:border-purple-600">Select</Button>
                        </Link>
                        <Link href={`/parts/memory/${ram.id}`}>
                            <Button variant="outline" size="sm" className="min-w-20 hover:border-blue-600">View</Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearPart('memory', index)}
                            className="min-w-20 hover:border-red-600"
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            ));
        } else {
            return (
                <div
                    className="flex items-center gap-4 border rounded py-2 px-2 m-1 shadow-border shadow-sm bg-sidebar">
                    <img src="/images/icons/gradient/memory.png" alt="Memory"
                         className="w-16 h-16 object-contain rounded"/>
                    <div className="flex-1">
                        <p className="font-semibold">Memory</p>
                        <p className="text-muted-foreground">No memory modules selected</p>
                    </div>
                    <div className="flex flex-col gap-1">

                        <Link href={`/parts/memory`}>
                            <Button variant="outline" size="sm"
                                    className="min-w-20 hover:border-purple-600">Select</Button>
                        </Link>
                    </div>
                </div>
            );
        }
    }

    const storageArray = Array.isArray(build.storage) ? build.storage : [];
    const primary = storageArray[0];
    const additional = storageArray.slice(1);

    function resetConfirm() {
        if (window.confirm('Are you sure you want to reset your build?')) {
            resetBuild();
        } else {
            toast.warning('Build not reset.');
        }
    }

    const handleNextPartClick = (e: React.MouseEvent, route: string) => {
        e.preventDefault();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        setTimeout(() => {
            window.location.href = `/${route}`;
        }, 100);
    };

    const renderNextPartButton = () => {
        const nextPart = getNextPartType(build);

        if (!nextPart) {
            return (
                <div className="text-blue-600">
                    Build Complete!
                </div>
            );
        }

        const route = partRoutes[nextPart] || `/parts/${nextPart}`;
        const displayName = displayNames[nextPart] || nextPart;

        return (
                <Link
                    href={`/${route}`}
                    onClick={(e) => handleNextPartClick(e, route)}
                >
                    <Button variant="outline" className="w-full max-w-md hover:border-purple-700">
                        <p>{displayName}</p>
                        <Blocks size={40} />
                    </Button>
                </Link>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-wrap items-center gap-2 border rounded my-4 py-4 px-6 m-1 shadow-border shadow bg-sidebar justify-between">
                <div className="flex flex-row items-center">
                    <p className="min-w-24">Build Name: </p>
                    <Input
                        value={buildName}
                        onChange={handleNameChange}
                        placeholder="Enter build name"
                        className="w-full max-w-md"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {getNextPartType(build) ? (
                        <>
                            <p className="text-muted-foreground">Next up:</p>
                            {renderNextPartButton()}
                        </>
                    ) : (
                        <div className="text-blue-600 font-medium">
                            Build Complete!
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {partKeys.map((key) => renderPart(key))}
                {renderMemory()}

                {/* Primary Storage */}
                <div
                    className="flex items-center gap-4 border rounded py-2 px-2 m-1 shadow-border shadow-sm bg-sidebar">
                    <img src={primary?.image_url || '/images/icons/gradient/storage.png'}
                         alt={primary?.name || 'Primary Storage'} className="w-16 h-16 object-contain rounded"/>
                    <div className="flex-1">
                        <p className="font-semibold">Primary Storage</p>
                        {primary ? (
                            <>
                                <p>{primary.manufacturer} {primary.name}</p>
                                <p className="text-sm text-muted-foreground">€ {primary.price ? primary.price.toFixed(2) : '0.00'}</p>
                            </>
                        ) : (
                            <p className="text-muted-foreground">No primary storage selected</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        {primary ? (
                            <>
                                <Link href={`/parts/storage`}>
                                    <Button variant="outline" size="sm"
                                            className="min-w-20 hover:border-purple-600">Select</Button>
                                </Link>
                                <Link href={`/parts/storage/${primary.id}`}>
                                    <Button variant="outline" size="sm"
                                            className="min-w-20 hover:border-blue-600">View</Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => clearPart('storage', 0)}
                                        className="min-w-20 hover:border-red-600">Remove</Button>
                            </>
                        ) : (
                            <Link href={`/parts/storage`}>
                                <Button variant="outline" size="sm"
                                        className="min-w-20 hover:border-purple-600">Select</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Storage & Extras */}
            {additional.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold px-2">Additional components</h3>
                    <div className="flex flex-col gap-2 px-2">
                        {additional.map((drive, index) => (
                            <div key={index + 1}
                                 className="flex items-center gap-4 border rounded py-2 px-2 m-1 shadow-border shadow-sm bg-sidebar">
                                <img src={drive?.image_url || `/images/icons/gradient/storage.png`}
                                     alt={drive?.name || 'Storage'} className="w-16 h-16 object-contain rounded"/>
                                <div className="flex-1">
                                    <p className="font-semibold">Additional Storage {index + 1}</p>
                                    <p>{drive.manufacturer} {drive.name}</p>
                                    <p className="text-sm text-muted-foreground">€ {drive.price ? drive.price.toFixed(2) : '0.00'}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Link href={`/parts/storage/${drive.id}`}>
                                        <Button variant="outline" size="sm"
                                                className="min-w-20 hover:border-blue-600">View</Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => clearPart('storage', drive._uid)}
                                        className="min-w-20 hover:border-red-600"
                                    >
                                        Remove
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setPrimaryStorage(index + 1)}
                                            className="text-xs">Mark as Primary</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="font-semibold text-xl text-center border-t-2 mt-8 p-4">
                Total: € {totalPrice.toFixed(2)}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 m-2 justify-center">
                <div className="flex items-center justify-center space-x-2">
                    <Label htmlFor="share-preference-toggle" className="font-medium">
                        Make public
                    </Label>
                    <Switch
                        id="share-preference-toggle"
                        checked={localIsSharedPreference}
                        onCheckedChange={setLocalIsSharedPreference}
                        disabled={!profile?.email}
                        aria-label="Toggle build sharing preference"
                    />
                </div>
                <Button
                    onClick={resetConfirm}
                    className="w-full sm:w-24 text-white bg-purple-900 hover:bg-purple-950">
                    Reset
                </Button>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        onClick={saveBuild}
                        className="w-full sm:w-24 text-white bg-purple-600 hover:bg-purple-700">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}