'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Case = {
    id: string
    name: string
    manufacturer: string
    mobo_form_factor: string
    psu_form_factor: string
    max_gpu_length: number
    color?: string
    side_panel: string
    price: number
    image_url?: string | null
}

type CaseCardProps = {
    pcCase: Case
    onAddToBuild?: (pcCase: Case) => void
}

export default function CaseCard({ pcCase, onAddToBuild }: CaseCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow =
        !imageError && pcCase.image_url
            ? pcCase.image_url
            : '/images/icons/gradient/case.png'

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/cases/${pcCase.id}`}>
            <span className="flex items-start">
              <img
                  src={imageToShow}
                  alt={pcCase.name}
                  className="w-12 h-12 object-contain rounded"
                  onError={() => setImageError(true)}
              />
              <h2 className="text-xl font-semibold ml-2">
                {pcCase.manufacturer} {pcCase.name}
              </h2>
            </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between m-3">
                    <p className="text-l mb-2">{pcCase.mobo_form_factor}</p>
                    {pcCase.color && <p className="text-l mb-2">{pcCase.color}</p>}
                    <p className="text-l mb-2">{pcCase.side_panel}</p>
                </div>
                <div className="flex justify-between items-center m-3">
                    <span className="font-semibold text-l">Price:</span>
                    <span className="font-semibold text-l">€ {pcCase.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700"
                            onClick={() => onAddToBuild(pcCase)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        >
                            <Link href={`/parts/cases/${pcCase.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}