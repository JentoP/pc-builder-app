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
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={motherboard.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{motherboard.manufacturer} {motherboard.name}</h1>
                    <p><strong>Chipset:</strong> {motherboard.chipset}</p>
                    <p><strong>Socket:</strong> {motherboard.socket}</p>
                    <p><strong>Form Factor:</strong> {motherboard.form_factor}</p>
                    <p><strong>RAM Interface:</strong> {motherboard.memory_type}</p>
                    <p><strong>Memory Slots:</strong> {motherboard.memory_slots}</p>
                    <p><strong>Max Memory:</strong> {motherboard.max_memory} GB</p>
                    <p><strong>SATA Slots:</strong> {motherboard.nvme_ports}</p>
                    <p><strong>M.2 Slots:</strong> {motherboard.nvme_ports}</p>
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {motherboard.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('motherboard', motherboard)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 text-blue-600 hover:border-blue-700 hover:text-blue-700">
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
