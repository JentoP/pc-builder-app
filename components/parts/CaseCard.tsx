'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Case = {
    id: string
    name: string
    manufacturer: string
    form_factor: string
    max_gpu_length: number
    color: string
    price: number
}

type CaseCardProps = {
    pcCase: Case
    onAddToBuild?: (pcCase: Case) => void
}

export default function CaseCard({ pcCase, onAddToBuild }: CaseCardProps) {
    const [image, setImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/parts-image?q=${encodeURIComponent(pcCase.name)}`)
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
    }, [pcCase.name])

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <Link href={`/parts/cases/${pcCase.id}`}>
                    {/*{error ? (*/}
                    {/*    <div className="w-full h-40 flex items-center justify-center text-red-500 rounded">*/}
                    {/*        <p className="text-sm">{error}</p>*/}
                    {/*    </div>*/}
                    {/*) : image ? (*/}
                    {/*    <img*/}
                    {/*        src={image}*/}
                    {/*        alt={pcCase.name}*/}
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
                        {pcCase.manufacturer} {pcCase.name}
                    </h2>
                </Link>
                <div className="flex justify-between text-sm mb-3">
                    <p>{pcCase.form_factor}</p>
                    <p>{pcCase.color}</p>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-md">Price:</span>
                    <span className="font-semibold text-md">€ {pcCase.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-center">
                        <Button
                            className="mt-3 px-4 py-1 rounded"
                            onClick={() => onAddToBuild(pcCase)}
                        >
                            Add to Build
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}