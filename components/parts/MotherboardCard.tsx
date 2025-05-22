'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Motherboard = {
    id: string
    name: string
    manufacturer: string
    chipset: string
    socket: string
    form_factor: string
    memory_type: string
    memory_slots: number
    max_memory: number
    price: number
}

type MotherboardCardProps = {
    motherboard: Motherboard
    onAddToBuild?: (mobo: Motherboard) => void
}

export default function MotherboardCard({ motherboard, onAddToBuild }: MotherboardCardProps) {
    const [image, setImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/parts-image?q=${encodeURIComponent(motherboard.name)}`)
                const data = await res.json()
                if (data.error) {
                    setError(data.error)
                    setImage(null)
                } else {
                    setImage(data.image || null)
                }
            } catch (err) {
                setError('Failed to fetch image')
                setImage(null)
            }
        }

        fetchImage()
    }, [motherboard.name])

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div>
                    <Link href={`/parts/motherboards/${motherboard.id}`}>
                        {/*{error ? (*/}
                        {/*    <div className="w-full h-40 flex items-center justify-center text-red-500 rounded">*/}
                        {/*        <p className="text-sm">{error}</p>*/}
                        {/*    </div>*/}
                        {/*) : image ? (*/}
                        {/*    <img*/}
                        {/*        src={image}*/}
                        {/*        alt={motherboard.name}*/}
                        {/*        className="w-full h-32 object-contain rounded"*/}
                        {/*        onError={() => {*/}
                        {/*            setError('Image failed to load')*/}
                        {/*            setImage(null)*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*) : (*/}
                        {/*    <div className="w-full h-40 flex items-center justify-center text-sm rounded">*/}
                        {/*        <Skeleton className="w-full h-full" />*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        <h2 className="text-xl font-semibold mb-1">
                            {motherboard.manufacturer} {motherboard.name}
                        </h2>
                    </Link>
                    <div className="flex gap-2 items-center justify-between mb-3">
                        <p className="text-l mb-2">{motherboard.socket}</p>
                        <p className="text-l mb-2">{motherboard.form_factor}</p>
                        <p className="text-l mb-2">{motherboard.memory_type}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-md">Price:</span>
                        <span className="font-semibold text-md">€ {motherboard.price.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex justify-center">
                    {onAddToBuild && (
                        <Button className="mt-3 px-4 py-1 rounded" onClick={() => onAddToBuild(motherboard)}>
                            Add to Build
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
