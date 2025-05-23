'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Memory = {
    id: string
    name: string
    manufacturer: string
    type: string
    size: number
    speed: number
    modules: number
    price: number
    image_url?: string | null
}

type MemoryCardProps = {
    memory: Memory
    onAddToBuild?: (memory: Memory) => void
}

export default function MemoryCard({ memory, onAddToBuild }: MemoryCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow =
        !imageError && memory.image_url
            ? memory.image_url
            : '/images/icons/gradient/memory.png'

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/memory/${memory.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={memory.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold ml-2">
                {memory.manufacturer} {memory.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between m-3">
                    <p className="text-l mb-2">{memory.type}</p>
                    <p className="text-l mb-2">{memory.size} GB</p>
                    <p className="text-l mb-2">{memory.speed} MHz</p>
                </div>
                <div className="flex justify-between items-center m-3">
                    <span className="font-semibold text-l">Price:</span>
                    <span className="font-semibold text-l">€ {memory.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700"
                            onClick={() => onAddToBuild(memory)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        >
                            <Link href={`/parts/memory/${memory.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}