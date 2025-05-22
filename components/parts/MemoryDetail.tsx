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
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={ram.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{ram.manufacturer} {ram.name}</h1>
                    <p><strong>Type:</strong> {ram.type}</p>
                    <p><strong>Speed:</strong> {ram.speed} MHz</p>
                    <p><strong>Size:</strong> {ram.size} GB</p>
                    <p><strong>Modules:</strong> {ram.modules} x</p>
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {ram.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('memory', ram)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 text-blue-600 hover:border-blue-700 hover:text-blue-700">
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
