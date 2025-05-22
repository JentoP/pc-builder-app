'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type GraphicCard = {
    id: string
    name: string
    manufacturer: string
    chipset: string
    memory: number
    core_clock: number
    boost_clock: number
    tdp: number
    price: number
}

type GraphicCardProps = {
    gpu: GraphicCard
    onAddToBuild?: (gpu: GraphicCard) => void
}

export default function GraphicCard({ gpu, onAddToBuild }: GraphicCardProps) {
    const [image, setImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/parts-image?q=${encodeURIComponent(gpu.name)}`)
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
    }, [gpu.name])

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div>
                    <Link href={`/parts/graphic-cards/${gpu.id}`}>
                        {/*{error ? (*/}
                        {/*    <div className="w-full h-40 flex items-center justify-center text-red-500 rounded">*/}
                        {/*        <p className="text-sm">{error}</p>*/}
                        {/*    </div>*/}
                        {/*) : image ? (*/}
                        {/*    <img*/}
                        {/*        src={image}*/}
                        {/*        alt={gpu.name}*/}
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
                            {gpu.manufacturer} {gpu.name}
                        </h2>
                    </Link>
                    <div className="flex gap-2 items-center justify-between mb-3">
                        <p className="text-l mb-2">{gpu.chipset}</p>
                        <p className="text-l mb-2">{gpu.memory} GB</p>
                        <p className="text-l mb-2">{gpu.core_clock} MHz</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-md">Price:</span>
                        <span className="font-semibold text-md">€ {gpu.price.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex justify-center">
                    {onAddToBuild && (
                        <Button className="mt-3 px-4 py-1 rounded" onClick={() => onAddToBuild(gpu)}>
                            Add to Build
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}