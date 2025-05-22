'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type PowerSupply = {
    id: string
    name: string
    manufacturer: string
    wattage: number
    efficiency_rating: string
    modular: boolean
    price: number
}

type Props = {
    psu: PowerSupply
    onAddToBuild?: (psu: PowerSupply) => void
}

export default function PowerSupplyCard({ psu, onAddToBuild }: Props) {
    const [image, setImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/parts-image?q=${encodeURIComponent(psu.name)}`)
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
    }, [psu.name])

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <Link href={`/parts/power_supplies/${psu.id}`}>
                    {/*{error ? (*/}
                    {/*    <div className="w-full h-40 flex items-center justify-center text-red-500 rounded">*/}
                    {/*        <p className="text-sm">{error}</p>*/}
                    {/*    </div>*/}
                    {/*) : image ? (*/}
                    {/*    <img*/}
                    {/*        src={image}*/}
                    {/*        alt={psu.name}*/}
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
                    <h2 className="text-xl font-semibold mb-1">{psu.manufacturer} {psu.name}</h2>
                </Link>
                <div className="flex gap-2 justify-between mb-3 text-sm">
                    <p>{psu.wattage}W</p>
                    <p>{psu.efficiency_rating}</p>
                    <p>{psu.modular ? 'Modular' : 'Non-Modular'}</p>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-md">Price:</span>
                    <span className="font-semibold text-md">€ {psu.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-center">
                        <Button
                            className="mt-3 px-4 py-1 rounded"
                            onClick={() => onAddToBuild(psu)}
                        >
                            Add to Build
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
