'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Motherboard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    socket: string;
    form_factor: string;
    memory_slots: number;
    max_memory: number;
    memory_type: string;
    sata_ports: number;
    nvme_ports: number;
    price: number;
    image_url?: string | null;
}

type MotherboardCardProps = {
    motherboard: Motherboard
    onAddToBuild?: (mobo: Motherboard) => void
}

export default function MotherboardCard({ motherboard, onAddToBuild }: MotherboardCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow =
        !imageError && motherboard.image_url
            ? motherboard.image_url
            : '/images/icons/gradient/motherboard.png'

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/motherboards/${motherboard.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={motherboard.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold ml-2">
                {motherboard.manufacturer} {motherboard.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between m-3">
                    <p className="text-l mb-2">{motherboard.socket}</p>
                    <p className="text-l mb-2">{motherboard.form_factor}</p>
                    <p className="text-l mb-2">{motherboard.chipset}</p>
                </div>
                <div className="flex justify-between items-center m-3">
                    <span className="font-semibold text-l">Price:</span>
                    <span className="font-semibold text-l">€ {motherboard.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700"
                            onClick={() => onAddToBuild(motherboard)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        >
                            <Link href={`/parts/motherboards/${motherboard.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
