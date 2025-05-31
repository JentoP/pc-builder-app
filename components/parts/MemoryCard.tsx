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
        <div className="w-full min-w-64">
            <div className="border bg-sidebar rounded-lg p-4 shadow hover:shadow-lg transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/memory/${memory.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={memory.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold mx-4">
                {memory.manufacturer} {memory.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between my-4 mx-2">
                    <p className="text-sm">{memory.type}</p>
                    <p className="text-sm">{memory.size} GB</p>
                    <p className="text-sm">{memory.speed} MHz</p>
                </div>
                <div className="flex justify-between items-center mb-2 mx-2">
                    <span className="text-l">Price </span>
                    <span className="text-l">€ {memory.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between p-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar"
                            onClick={() => onAddToBuild(memory)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar"
                        >
                            <Link href={`/parts/memory/${memory.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}