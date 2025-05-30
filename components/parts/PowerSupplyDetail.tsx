'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';

type PowerSupply = {
    id: string;
    name: string;
    manufacturer: string;
    wattage: number;
    form_factor: string;
    efficiency_rating: string;
    modularity: string;
    price: number;
    image_url?: string | null;
};

export default function PowerSupplyDetail({ psu }: { psu: PowerSupply }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();

    const imageSrc = !imageError && psu.image_url
        ? psu.image_url
        : '/images/icons/gradient/psu.png';

    const isAdmin = true; // Replace with actual logic

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={psu.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {psu.manufacturer} {psu.name}
                </h1>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Wattage</span>
                    <span>{psu.wattage} W</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Form Factor</span>
                    <span>{psu.form_factor}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Efficiency Rating</span>
                    <span>{psu.efficiency_rating}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Modularity</span>
                    <span>{psu.modularity}</span>
                </div>
                <div className="flex justify-between pt-3 text-xl font-semibold">
                    <span>Price</span>
                    <span>€ {psu.price.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('psu', psu)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 border text-purple-600 border-purple-600 min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 border-blue-600 text-blue-600">
                    <a href={`https://www.google.com/search?q=${psu.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* {isAdmin && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
                    <Button variant="secondary">
                        Edit Power Supply
                    </Button>
                </div>
            )} */}
        </div>
    );
}
