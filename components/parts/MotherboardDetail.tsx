'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';

type Motherboard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    socket: string;
    form_factor: string;
    memory_slots: number;
    max_memory: number;
    memory_type: string;
    sata_ports: number;
    nvme_ports: number;
    price: number;
    image_url?: string | null;
};

export default function MotherboardDetail({ motherboard }: { motherboard: Motherboard }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();

    const imageSrc = !imageError && motherboard.image_url
        ? motherboard.image_url
        : '/images/icons/gradient/motherboard.png';

    const isAdmin = true; // Replace with actual admin logic

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={motherboard.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {motherboard.manufacturer} {motherboard.name}
                </h1>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Chipset</span>
                    <span>{motherboard.chipset}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Socket</span>
                    <span>{motherboard.socket}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Form Factor</span>
                    <span>{motherboard.form_factor}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">RAM Interface</span>
                    <span>{motherboard.memory_type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Max Memory</span>
                    <span>{motherboard.max_memory} GB</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Memory Slots</span>
                    <span>{motherboard.memory_slots}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">SATA Slots</span>
                    <span>{motherboard.sata_ports}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">M.2 Slots</span>
                    <span>{motherboard.nvme_ports}</span>
                </div>
                <div className="flex justify-between pt-3 text-xl font-semibold">
                    <span>Price</span>
                    <span>€ {motherboard.price.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('motherboard', motherboard)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 border text-purple-600 border-purple-600 min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 border-blue-600 text-blue-600">
                    <a href={`https://www.google.com/search?q=${motherboard.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* Uncomment for admin editing */}
            {/* {isAdmin && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
                    <Button variant="secondary">
                        Edit Motherboard
                    </Button>
                </div>
            )} */}
        </div>
    );
}
