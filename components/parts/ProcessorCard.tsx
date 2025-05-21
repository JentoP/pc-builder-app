'use client'
import {useEffect, useState} from 'react'
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";

type Processor = {
    id: string
    name: string
    manufacturer: string
    socket: string
    cores: number
    threads: number
    base_clock: number
    boost_clock: number
    tdp: number
    price: number
}
type ProcessorCardProps = {
    cpu: Processor;
    onAddToBuild?: (cpu: Processor) => void;
};
export default function ProcessorCard({cpu, onAddToBuild}: ProcessorCardProps) {
    const [image, setImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/parts-image?q=${encodeURIComponent(cpu.name)}`)
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
    }, [cpu.name])

    return (
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200">
                <Link href={`/parts/processors/${cpu.id}`}>
                    {error ? (
                        <div className="w-full h-40 flex items-center justify-center text-red-500 rounded">
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : image ? (
                        <img
                            src={image}
                            alt={cpu.name}
                            className="w-full h-40 object-contain rounded"
                            onError={() => {
                                setError('Image failed to load')
                                setImage(null)
                            }}
                        />
                    ) : (
                        <div className="w-full h-40 flex items-center justify-center text-sm rounded">
                            <Skeleton className="w-full h-full"/>
                        </div>
                    )}
                    <h2 className="text-xl font-semibold mb-1">{cpu.manufacturer} {cpu.name}</h2>
                    <div className="flex gap-2 items-center justify-between mb-3">
                        <p className="text-l mb-2">{cpu.socket}</p>
                        <p className="text-l mb-2">{cpu.cores} Cores</p>
                        <p className="text-l mb-2">{cpu.base_clock} GHz</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-md">Price:</span>
                        <span className="font-semibold text-md">${cpu.price.toFixed(2)}</span>
                    </div>
                </Link>
                {
                    onAddToBuild && (
                        <button
                            className="mt-3 bg-green-500 text-white px-4 py-1 rounded"
                            onClick={() => onAddToBuild(cpu)}
                        >
                            Add to Build
                        </button>
                    )
                }
            </div>
        </div>
    )
}