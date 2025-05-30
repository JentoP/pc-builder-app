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
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={storage.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {storage.manufacturer} {storage.name}
                </h1>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Type</span>
                    <span>{storage.type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Interface</span>
                    <span>{storage.interface}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Capacity</span>
                    <span>{storage.capacity} GB</span>
                </div>
                <div className="flex justify-between pt-3 text-xl font-semibold">
                    <span>Price</span>
                    <span>€ {storage.price.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('storage', storage)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 border text-purple-600 border-purple-600 min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 border-blue-600 text-blue-600">
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
