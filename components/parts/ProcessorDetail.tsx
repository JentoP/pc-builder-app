'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Processor = {
    id: string;
    name: string;
    manufacturer: string;
    socket: string;
    cores: number;
    threads: number;
    base_clock: number;
    boost_clock: number;
    tdp: number;
    price: number;
    image_url?: string | null;
};

export default function CpuDetail({ cpu }: { cpu: Processor }) {
    const [imageError, setImageError] = useState(false);
    const imageSrc = !imageError && cpu.image_url ? cpu.image_url : '/images/icons/gradient/processor.png';

    const isAdmin = true;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={cpu.name}
                    className="w-24 h-24 object-contain rounded border"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{cpu.manufacturer} {cpu.name}</h1>
                    <p className="text-gray-700 mb-1"><strong>Socket:</strong> {cpu.socket}</p>
                    <p className="text-gray-700 mb-1"><strong>Cores:</strong> {cpu.cores}</p>
                    <p className="text-gray-700 mb-1"><strong>Threads:</strong> {cpu.threads}</p>
                    <p className="text-gray-700 mb-1"><strong>Base Clock:</strong> {cpu.base_clock} GHz</p>
                    <p className="text-gray-700 mb-1"><strong>Boost Clock:</strong> {cpu.boost_clock} GHz</p>
                    <p className="text-gray-700 mb-1"><strong>TDP:</strong> {cpu.tdp} W</p>
                    <p className="text-gray-900 font-semibold mt-4"><strong>Price:</strong> € {cpu.price.toFixed(2)}</p>
                </div>
            </div>

            {isAdmin && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
                    <Button>Edit Processor</Button>
                </div>
            )}
        </div>
    );
}
