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
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={cooler.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {cooler.manufacturer} {cooler.name}
                </h1>
            </div>
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
            <div className="flex justify-between pt-4 border-t">
                <Button 
                    onClick={() => updateBuild('cooling', cooler)}
                    variant="outline" 
                    size="sm"
                    className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar min-w-24">
                    Add to Build
                </Button>
                <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar min-w-24">
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
