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
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [buildName, setBuildName] = useState(build.name || "My PC Build");
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {data: {user}, error} = await supabase.auth.getUser();
            if (error) {
                toast.error("Failed to load user.");
            }
            setUserId(user?.id || null);
            setLoading(false);
        };
        getUser();
    }, []);

    useEffect(() => {
        setBuildName(build.name || "My PC Build");
    }, [build]);

    if (loading || !userId) {
        return (
            <SignInWarning/>
        )
    }

    const saveBuild = async () => {
        if (!userId) {
            toast.warning("You must be logged in to save a build.");
            return;
        }

        const {error} = await supabase.from('builds').insert([
            {
                user_id: userId,
                build_data: {
                    ...build,
                    name: buildName
                },
            },
        ]);

        if (error) {
            toast.error("Failed to save build.");
        } else {
            resetBuild();
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
                                <Button variant="outline" size="sm"
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
                            <Button variant="outline" size="sm"
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

    const renderNextPartButton = () => {
        const nextPart = getNextPartType(build);
        if (!nextPart) return null;

        // Use partRoutes if available, otherwise construct the route with absolute path
        const route = partRoutes[nextPart] || `/parts/${nextPart}`;
        const displayName = displayNames[nextPart] || nextPart;

        return (
            <div className="">
                <Link href={`/${route}`}>
                    <Button variant="outline" className="w-full max-w-md">
                        <p >{displayName}</p>
                        <Blocks size={40} />
                    </Button>
                </Link>
            </div>
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
                    <p className="text-muted-foreground">Next up:</p>
                    {renderNextPartButton()}
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
            {/*<div className="mt-4">*/}
            {/*    <h3 className="text-lg font-semibold px-2">Extras</h3>*/}
            {/*    <div className="flex flex-col gap-2 px-2">*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="font-semibold text-xl text-center border-t-2 mt-8 p-4">
                Total: € {totalPrice.toFixed(2)}
            </div>
            <div className="mt-4 flex flex-row sm:flex-row gap-2 m-2 justify-center">
                <Button
                    onClick={resetConfirm}
                    className="w-full md:w-auto text-white bg-purple-900 hover:bg-purple-950 min-w-24">Reset</Button>
                <Button onClick={saveBuild}
                        className="w-full md:w-auto text-white bg-purple-600 hover:bg-purple-700 min-w-40">Save</Button>
                <Button
                    className="w-full md:w-auto text-white bg-blue-600 hover:bg-blue-700 min-w-24">Share</Button>
            </div>
        </div>
    );
}