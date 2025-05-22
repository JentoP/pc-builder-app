'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';
import Link from 'next/link';

type GraphicCard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    memory_size: number;
    memory_type: string;
    length_mm: number;
    tdp: number;
    price: number;
    image_url?: string | null;
};

export default function GraphicCardDetail({ card }: { card: GraphicCard }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();

    const imageSrc = !imageError && card.image_url
        ? card.image_url
        : '/images/icons/gradient/graphic-card.png';

    const isAdmin = true; // Replace with real admin logic

    return (
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={card.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{card.manufacturer} {card.name}</h1>
                    <p><strong>Chipset:</strong> {card.chipset}</p>
                    <p><strong>Memory:</strong> {card.memory_size} GB {card.memory_type}</p>
                    <p><strong>Length:</strong> {card.length_mm} mm</p>
                    <p><strong>TDP:</strong> {card.tdp} W</p>
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {card.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Link href={`/builds/new`}
                      onClick={(e) => {
                          e.preventDefault();
                          updateBuild('gpu', card);
                      }}
                      className="w-full">
                    <Button variant="outline" size="sm">
                        Add to Build
                    </Button>
                </Link>
                {isAdmin && (
                    <Link href={`/admin/parts/${card.id}/edit`} className="w-full">
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </Link>
                )}
            </div>
            {/* Uncomment for admin control */}
            {/* {isAdmin && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
                    <Button variant="secondary">
                        Edit Graphic Card
                    </Button>
                </div>
            )} */}
        </div>
    );
}
