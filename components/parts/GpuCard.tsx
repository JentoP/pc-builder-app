'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type GraphicCard = {
    id: string
    name: string
    manufacturer: string
    chipset: string
    memory: number
    core_clock: number
    boost_clock: number
    tdp: number
    price: number
    image_url?: string | null
}

type GraphicCardProps = {
    gpu: GraphicCard
    onAddToBuild?: (gpu: GraphicCard) => void
}

export default function GraphicCardCard({ gpu, onAddToBuild }: GraphicCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow =
        !imageError && gpu.image_url
            ? gpu.image_url
            : '/images/icons/gradient/graphic-card.png'

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/graphic-cards/${gpu.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={gpu.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold ml-2">
                {gpu.manufacturer} {gpu.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between m-3">
                    <p className="text-l mb-2">{gpu.chipset}</p>
                    <p className="text-l mb-2">{gpu.memory} GB</p>
                    <p className="text-l mb-2">{gpu.core_clock} MHz</p>
                </div>
                <div className="flex justify-between items-center m-3">
                    <span className="font-semibold text-l">Price:</span>
                    <span className="font-semibold text-l">€ {gpu.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700"
                            onClick={() => onAddToBuild(gpu)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        >
                            <Link href={`/parts/graphic-cards/${gpu.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
