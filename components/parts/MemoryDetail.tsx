'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';
import Link from 'next/link';

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

    const imageSrc = !imageError && memory.image_url
        ? memory.image_url
        : '/images/icons/gradient/memory.png';

    const isAdmin = true; // Replace with real admin logic

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-6">
                <img
                    src={imageSrc}
                    alt={memory.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div className="flex-1 space-y-2">
                    <h1 className="text-2xl font-bold">
                        {memory.manufacturer} {memory.name}
                    </h1>
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
                            <span>{memory.modules} x {memory.size / memory.modules}GB</span>
                        </div>
                        <div className="flex justify-between pt-3 text-xl font-semibold">
                            <span>Price</span>
                            <span>€ {memory.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between pt-4 border-t mt-4">
                        <Button 
                            onClick={() => updateBuild('memory', memory)}
                            variant="outline"
                            size="sm"
                            className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white min-w-24"
                        >
                            Add to Build
                        </Button>
                        <Link 
                            href={`https://www.google.com/search?q=${encodeURIComponent(memory.manufacturer + ' ' + memory.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white min-w-24"
                            >
                                Search
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            {/*{isAdmin && (*/}
            {/*    <div className="mt-6 border-t pt-4">*/}
            {/*        <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>*/}
            {/*        <Button variant="secondary">*/}
            {/*            Edit Memory*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}
