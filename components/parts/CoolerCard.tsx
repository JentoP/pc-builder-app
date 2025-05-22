'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Cooler = {
    id: string
    name: string
    manufacturer: string
    type: string        // e.g., Air, Liquid, AIO
    socket_compatibility: string
    fan_rpm?: number    // optional
    noise_level?: number // optional, in dB
    price: number
    image_url?: string | null
}

type CoolerCardProps = {
    cooler: Cooler
    onAddToBuild?: (cooler: Cooler) => void
}

export default function CoolerCard({ cooler, onAddToBuild }: CoolerCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow =
        !imageError && cooler.image_url
            ? cooler.image_url
            : '/images/icons/gradient/cooler.png'

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/coolers/${cooler.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={cooler.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold ml-2">
                {cooler.manufacturer} {cooler.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between m-3">
                    <p className="text-l mb-2">{cooler.type}</p>
                    <p className="text-l mb-2">{cooler.socket_compatibility}</p>
                    {cooler.fan_rpm && <p className="text-l mb-2">{cooler.fan_rpm} RPM</p>}
                    {cooler.noise_level && <p className="text-l mb-2">{cooler.noise_level} dB</p>}
                </div>
                <div className="flex justify-between items-center m-3">
                    <span className="font-semibold text-l">Price:</span>
                    <span className="font-semibold text-l">€ {cooler.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700"
                            onClick={() => onAddToBuild(cooler)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        >
                            <Link href={`/parts/coolers/${cooler.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
