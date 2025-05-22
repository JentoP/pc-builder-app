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
        : '/images/icons/gradient/cooler.png';

    const isAdmin = true; // Replace with actual admin logic

    return (
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={cooler.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{cooler.manufacturer} {cooler.name}</h1>
                    <p><strong>Type:</strong> {cooler.type}</p>
                    <p><strong>Socket Compatibility:</strong> {cooler.socket_compatibility}</p>
                    {cooler.radiator_size && <p><strong>Radiator Size:</strong> {cooler.radiator_size}</p>}
                    {cooler.noise_level && <p><strong>Noise Level:</strong> {cooler.noise_level}</p>}
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {cooler.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('cooling', cooler)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <a href={`https://www.google.com/search?q=${cooler.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* {isAdmin && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
          <Button variant="secondary">Edit Cooler</Button>
        </div>
      )} */}
        </div>
    );
}
