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
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={psu.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{psu.manufacturer} {psu.name}</h1>
                    <p><strong>Wattage:</strong> {psu.wattage} W</p>
                    <p><strong>Form Factor:</strong> {psu.form_factor}</p>
                    <p><strong>Efficiency Rating:</strong> {psu.efficiency_rating}</p>
                    <p><strong>Modularity:</strong> {psu.modularity}</p>
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {psu.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('psu', psu)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <a href={`https://www.google.com/search?q=${psu.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* {isAdmin && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
          <Button variant="secondary">Edit Power Supply</Button>
        </div>
      )} */}
        </div>
    );
}
