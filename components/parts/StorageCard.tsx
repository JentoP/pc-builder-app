'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Storage = {
    id: string
    name: string
    manufacturer: string
    type: string
    capacity: number
    interface: string
    price: number
    image_url?: string | null
}

type StorageCardProps = {
    drive: Storage
    onAddToBuild?: (drive: Storage) => void
}

export default function StorageCard({ drive, onAddToBuild }: StorageCardProps) {
    const [imageError, setImageError] = useState(false)

    const imageToShow = !imageError && drive.image_url ? drive.image_url : '/images/icons/gradient/storage.png'

    return (
        <div className="w-full min-w-64">
            <div className="border bg-sidebar rounded-lg p-4 shadow hover:shadow-lg transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/storage/${drive.id}`}>
                        <span className="flex items-start">
                            <img
                                src={imageToShow}
                                alt={drive.name}
                                className="w-12 h-12 object-contain rounded"
                                onError={() => setImageError(true)}
                            />
                            <h2 className="text-xl font-semibold mx-4">{drive.manufacturer} {drive.name}</h2>
                        </span>
                    </Link>
                </div>
                <div className="flex gap-2 items-center justify-between my-4 mx-2 text-sm">
                    <p>{drive.type}</p>
                    <p>{drive.capacity} GB</p>
                    <p>{drive.interface}</p>
                </div>
                <div className="flex justify-between items-center mb-2 mx-2">
                    <span className="text-l">Price </span>
                    <span className="text-l">€ {drive.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between p-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 border-purple-600 hover:text-primary"
                            onClick={() => onAddToBuild(drive)}
                        >
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 border-blue-600 hover:text-primary"
                        >
                            <Link href={`/parts/storage/${drive.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
