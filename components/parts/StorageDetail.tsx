'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';

type Storage = {
    id: string;
    name: string;
    manufacturer: string;
    type: string;
    interface: string;
    capacity: number;
    price: number;
    image_url?: string | null;
};

export default function StorageDetail({ storage }: { storage: Storage }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();

    const imageSrc = !imageError && storage.image_url
        ? storage.image_url
        : '/images/icons/gradient/storage.png';

    const isAdmin = true; // Replace with your admin check logic

    return (
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={storage.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{storage.manufacturer} {storage.name}</h1>
                    <p><strong>Type:</strong> {storage.type}</p>
                    <p><strong>Interface:</strong> {storage.interface}</p>
                    <p><strong>Capacity:</strong> {storage.capacity} GB</p>
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {storage.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('storage', storage)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <a href={`https://www.google.com/search?q=${storage.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* {isAdmin && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
          <Button variant="secondary">
            Edit Storage
          </Button>
        </div>
      )} */}
        </div>
    );
}
