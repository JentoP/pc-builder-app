'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';

type Cooler = {
    id: string;
    name: string;
    manufacturer: string;
    type: string;
    socket_compatibility: string;
    radiator_size: string | null;
    noise_level: string | null;
    price: number;
    image_url?: string | null;
};

export default function CoolerDetail({ cooler }: { cooler: Cooler }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();

    const imageSrc = !imageError && cooler.image_url
        ? cooler.image_url
        : '/images/icons/gradient/cooling.png';

    const isAdmin = true; // Replace with actual admin logic

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={cooler.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div className="p-4 rounded-lg w-full">
                    <h1 className="text-2xl font-bold my-4">
                        {cooler.manufacturer} {cooler.name}
                    </h1>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Type</span>
                            <span>{cooler.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Socket Compatibility</span>
                            <span>{cooler.socket_compatibility}</span>
                        </div>
                        {cooler.radiator_size && (
                            <div className="flex justify-between">
                                <span className="font-medium">Radiator Size</span>
                                <span>{cooler.radiator_size}</span>
                            </div>
                        )}
                        {cooler.noise_level && (
                            <div className="flex justify-between">
                                <span className="font-medium">Noise Level</span>
                                <span>{cooler.noise_level}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-3 text-xl font-semibold">
                            <span>Price</span>
                            <span>€ {cooler.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('cooling', cooler)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 border text-purple-600 border-purple-600 min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 border-blue-600 text-blue-600">
                    <a href={`https://www.google.com/search?q=${cooler.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* {isAdmin && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
                    <Button variant="secondary">
                        Edit Cooler
                    </Button>
                </div>
            )} */}
        </div>
    );
}
