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

export default function MemoryDetail({ memory }: { memory: Memory }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();
    const imageSrc = !imageError && memory.image_url ? memory.image_url : '/images/icons/gradient/memory.png';

    const isAdmin = true;

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={memory.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {memory.manufacturer} {memory.name}
                </h1>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Type</span>
                    <span>{memory.type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Speed</span>
                    <span>{memory.speed} MHz</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Size</span>
                    <span>{memory.size} GB</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Modules</span>
                    <span>{memory.modules} × {memory.size / memory.modules} GB</span>
                </div>
                <div className="flex justify-between pt-3 text-xl font-semibold">
                    <span>Price</span>
                    <span>€ {memory.price.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button
                    onClick={() => updateBuild('memory', memory)}
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar min-w-24"
                >
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar min-w-24"
                >
                    <a href={`https://www.google.com/search?q=${memory.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
        </div>
    );
}
