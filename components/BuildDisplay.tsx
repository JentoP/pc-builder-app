'use client';

import {useBuild} from '@/hooks/useBuild';
import {Button} from "@/components/ui/button";
import Link from 'next/link';
import {createClient} from '@/utils/supabase/client';
import {toast} from 'sonner';
import {useEffect, useState} from 'react';

const partRoutes: Record<string, string> = {
    processor: 'parts/processors',
    motherboard: 'parts/motherboards',
    memory: 'parts/memory',
    gpu: 'parts/graphic-cards',
    storage: 'parts/storage',
    psu: 'parts/power-supplies',
    case: 'parts/cases',
    cooling: 'parts/cooling',
};

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
    };

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                {Object.entries(build).map(([key, part]) => (
                    <div
                        key={key}
                        className="border rounded p-4 flex flex-col justify-between"
                    >
                        <div className="mb-2">
                            <p className="font-semibold capitalize">{key}</p>
                            {part ? (
                                <p>{part.name}</p>
                            ) : (
                                <p className="text-sm text-gray-500">Not selected</p>
                            )}
                        </div>
                        <div className="flex gap-2 mt-auto">
                            {part && (
                                <Button
                                    variant="secondary"
                                    onClick={() => clearPart(key as keyof typeof build)}
                                >
                                    Remove
                                </Button>
                            )}
                            <Link href={`/${partRoutes[key]}`} passHref>
                                <Button variant="outline">Select</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button variant="destructive" onClick={resetBuild} className="w-full sm:w-auto">
                    Reset
                </Button>
                <Button onClick={saveBuild} className="w-full sm:w-auto">
                    Save
                </Button>
            </div>
        </div>
    );
}
