'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type PowerSupply = {
    id: string
    name: string
    manufacturer: string
    wattage: number       // e.g., 650
    efficiency_rating: string  // e.g., '80+ Gold'
    modular: boolean
    price: number
    image_url?: string | null
}

type PowerSupplyCardProps = {
    psu: PowerSupply
    onAddToBuild?: (psu: PowerSupply) => void
}

export default function PowerSupplyCard({ psu, onAddToBuild }: PowerSupplyCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow =
        !imageError && psu.image_url
            ? psu.image_url
            : '/images/icons/gradient/psu.png'

    return (
        <div className="w-full min-w-64">
            <div className="border bg-sidebar rounded-lg p-4 shadow hover:shadow-lg transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/power-supplies/${psu.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={psu.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold mx-4">
                {psu.manufacturer} {psu.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between my-4 mx-2">
                    <p className="text-sm">{psu.wattage} W</p>
                    <p className="text-sm">{psu.efficiency_rating}</p>
                    <p className="text-sm">{psu.modular ? 'Modular' : 'Non-Modular'}</p>
                </div>
                <div className="flex justify-between items-center mb-2 mx-2">
                    <span className="text-l">Price </span>
                    <span className="text-l">€ {psu.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between p-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar"
                            onClick={() => onAddToBuild(psu)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar"
                        >
                            <Link href={`/parts/power-supplies/${psu.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
