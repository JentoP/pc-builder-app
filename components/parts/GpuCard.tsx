'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type GraphicCard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    memory_size: number;
    memory_type: string;
    length_mm: number;
    nr_of_cores: number;
    core_clock_mhz: number;
    tdp: number;
    price: number;
    image_url?: string | null;
}

type GraphicCardProps = {
    gpu: GraphicCard
    onAddToBuild?: (gpu: GraphicCard) => void
}

export default function GpuCard({ gpu, onAddToBuild }: GraphicCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow =
        !imageError && gpu.image_url
            ? gpu.image_url
            : '/images/icons/gradient/graphic-card.png'

    return (
        <div className="w-full min-w-64">
            <div className="border bg-sidebar rounded-lg p-4 shadow hover:shadow-lg transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/graphic-cards/${gpu.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={gpu.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold mx-4">
                {gpu.manufacturer} {gpu.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between my-4 mx-2">
                    <p className="text-sm">{gpu.chipset}</p>
                    <p className="text-sm">{gpu.memory_size} GB</p>
                    <p className="text-sm">{gpu.core_clock_mhz} MHz</p>
                </div>
                <div className="flex justify-between items-center mb-2 mx-2">
                    <span className="text-l">Price </span>
                    <span className="text-l">€ {gpu.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between p-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar"
                            onClick={() => onAddToBuild(gpu)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar"
                        >
                            <Link href={`/parts/graphic-cards/${gpu.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
