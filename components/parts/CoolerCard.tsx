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
            : '/images/icons/gradient/cooling.png'

    return (
        <div className="w-full min-w-64">
            <div className="border bg-sidebar rounded-lg p-4 shadow hover:shadow-lg transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/coolers/${cooler.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={cooler.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold mx-4">
                {cooler.manufacturer} {cooler.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between my-4 mx-2">
                    <p className="text-sm">{cooler.type}</p>
                    <p className="text-sm">{cooler.socket_compatibility}</p>
                    {cooler.fan_rpm && <p className="text-sm">{cooler.fan_rpm} RPM</p>}
                    {cooler.noise_level && <p className="text-sm">{cooler.noise_level} dB</p>}
                </div>
                <div className="flex justify-between items-center mb-2 mx-2">
                    <span className="text-l">Price </span>
                    <span className="text-l">€ {cooler.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between p-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar"
                            onClick={() => onAddToBuild(cooler)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar"
                        >
                            <Link href={`/parts/coolers/${cooler.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
