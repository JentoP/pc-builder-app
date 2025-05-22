'use client'

import {useBuild} from '@/hooks/useBuild'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {createClient} from '@/utils/supabase/client'
import {toast} from 'sonner'
import {useEffect, useState} from 'react'

const partKeys: string[] = [
    'processor', 'motherboard', 'memory', 'storage',
    'cooling', 'psu', 'case', 'gpu',
]

const partRoutes: Record<string, string> = {
    processor: 'parts/processors',
    motherboard: 'parts/motherboards',
    memory: 'parts/memory',
    storage: 'parts/storage',
    cooling: 'parts/coolers',
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
    const {build, clearPart, resetBuild} = useBuild();
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();
    // Get current user from Supabase
    useEffect(() => {
        const getUser = async () => {
            const {data: {user}, error} = await supabase.auth.getUser();
            if (error) {
                toast.error("Failed to load user.");
                return;
            }
            setUserId(user?.id || null);
        };
        getUser();
    }, []);

    const saveBuild = async () => {
        if (!userId) {
            toast.warning("You must be logged in to save a build.");
            return;
        }

        const {error} = await supabase.from('builds').insert([
            {
                user_id: userId,
                build_data: build,
            },
        ]);

        if (error) {
            toast.error("Failed to save build.");
        } else {
            toast.success("Build saved successfully!");
        }
    }

    const totalPrice = partKeys.reduce((sum, key) => {
        // @ts-ignore
        const part = build[key]
        return sum + (part?.price || 0)
    }, 0)

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                {partKeys.map((key) => {
                    // @ts-ignore
                    const part = build[key]
                    const route = partRoutes[key]
                    const displayName = displayNames[key] || key
                    const imageKey = key === 'gpu' ? 'graphic-card' : key
                    const imageUrl = part?.image_url || `/images/icons/gradient/${imageKey}.png`

                    return (
                        <div key={key} className="flex items-center gap-4 border-b py-2 px-2">
                            {/* Left: Buttons */}
                            <div className="flex flex-col gap-1">

                                <img
                                    src={imageUrl}
                                    alt={part?.name || displayName}
                                    className="w-16 h-16 object-contain rounded"
                                />
                            </div>

                            {/* Center: Text */}
                            <div className="flex-1">
                                <p className="font-semibold">{displayName}</p>
                                {part ? (
                                    <>
                                        <p>{part.manufacturer} {part.name}</p>
                                        <p className="text-sm text-muted-foreground">€ {part.price.toFixed(2)}</p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">No part selected</p>
                                )}
                            </div>

                            {/* Right: Image */}

                            <div className="flex flex-col gap-1 w-min-20">
                                {part ? (
                                    <>
                                        <Link href={`/${route}/${part.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                View
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-purple-600 hover:text-purple-700"
                                            onClick={() => clearPart(key)}
                                        >
                                            Remove
                                        </Button>
                                    </>
                                ) : (
                                    <Link href={`/${route}`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            Select
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                    )
                })}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button variant="destructive" onClick={resetBuild} className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
                    Reset
                </Button>
                <Button onClick={saveBuild} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 ">
                    Save
                </Button>
            </div>
        </div>
    );
}