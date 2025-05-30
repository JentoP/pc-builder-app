'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';

type Memory = {
    id: string;
    name: string;
    manufacturer: string;
    type: string;
    speed: number;
    size: number;
    modules: number;
    price: number;
    image_url?: string | null;
};

export default function MemoryDetail({ ram }: { ram: Memory }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();

    const imageSrc = !imageError && ram.image_url
        ? ram.image_url
        : '/images/icons/gradient/memory.png';

    const isAdmin = true; // Replace with real admin logic

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={ram.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {ram.manufacturer} {ram.name}
                </h1>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Type</span>
                    <span>{ram.type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Speed</span>
                    <span>{ram.speed} MHz</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Size</span>
                    <span>{ram.size} GB</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Modules</span>
                    <span>{ram.modules} x</span>
                </div>
                <div className="flex justify-between pt-3 text-xl font-semibold">
                    <span>Price</span>
                    <span>€ {ram.price.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('memory', ram)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 border text-purple-600 border-purple-600 min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 border-blue-600 text-blue-600">
                    <a href={`https://www.google.com/search?q=${ram.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* Uncomment to enable admin controls */}
            {/* {isAdmin && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
                    <Button variant="secondary">
                        Edit Memory
                    </Button>
                </div>
            )} */}
        </div>
    );
}
