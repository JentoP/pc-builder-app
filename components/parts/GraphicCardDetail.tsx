'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';

type GraphicCard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    memory_size: number;
    memory_type: string;
    tdp: number;
    core_clock_mhz: number;
    nr_of_cores: number;
    price: number;
    image_url?: string | null;
};

export default function GraphicCardDetail({ card }: { card: GraphicCard }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();
    const imageSrc = !imageError && card.image_url ? card.image_url : '/images/icons/gradient/graphic-card.png';

    const isAdmin = true;

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={card.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {card.manufacturer} {card.name}
                </h1>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Chipset</span>
                    <span>{card.chipset}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Memory</span>
                    <span>{card.memory_size} GB {card.memory_type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Core Clock</span>
                    <span>{card.core_clock_mhz} MHz</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">TDP</span>
                    <span>{card.tdp} W</span>
                </div>
                <div className="flex justify-between pt-3 text-xl font-semibold">
                    <span>Price</span>
                    <span>€ {card.price.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button
                    onClick={() => updateBuild('gpu', card)}
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar min-w-24"
                >
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar min-w-24"
                >
                    <a href={`https://www.google.com/search?q=${card.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
        </div>
    );
}
