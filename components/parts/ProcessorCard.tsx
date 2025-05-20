'use client'
import {useEffect, useState} from 'react'
import {Skeleton} from "@/components/ui/skeleton";

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

export default function ProcessorCard({cpu}: { cpu: Processor }) {
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
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200">
            <div className="mb-3">
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
            </div>
            <h2 className="text-lg font-semibold mb-1">{cpu.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{cpu.manufacturer} — {cpu.socket}</p>
            <ul className="text-sm space-y-1">
                <li><strong>Cores:</strong> {cpu.cores}</li>
                <li><strong>Threads:</strong> {cpu.threads}</li>
                <li><strong>Base Clock:</strong> {cpu.base_clock} GHz</li>
                <li><strong>Boost Clock:</strong> {cpu.boost_clock} GHz</li>
                <li><strong>TDP:</strong> {cpu.tdp} W</li>
                <li><strong>Price:</strong> ${cpu.price.toFixed(2)}</li>
            </ul>
        </div>
    )
}
