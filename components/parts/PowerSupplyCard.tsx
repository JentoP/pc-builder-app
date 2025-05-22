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
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/power-supplies/${psu.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={psu.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold ml-2">
                {psu.manufacturer} {psu.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between m-3">
                    <p className="text-l mb-2">{psu.wattage} W</p>
                    <p className="text-l mb-2">{psu.efficiency_rating}</p>
                    <p className="text-l mb-2">{psu.modular ? 'Modular' : 'Non-Modular'}</p>
                </div>
                <div className="flex justify-between items-center m-3">
                    <span className="font-semibold text-l">Price:</span>
                    <span className="font-semibold text-l">€ {psu.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700"
                            onClick={() => onAddToBuild(psu)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        >
                            <Link href={`/parts/power-supplies/${psu.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
