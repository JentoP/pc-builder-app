'use client'
import {useState} from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";

type Processor = {
    id: string;
    name: string;
    manufacturer: string;
    socket: string;
    cores: number;
    threads: number;
    base_clock: number;
    boost_clock: number;
    tdp: number;
    price: number;
    image_url?: string | null;
};

type ProcessorCardProps = {
    cpu: Processor;
    onAddToBuild?: (cpu: Processor) => void;
};

export default function ProcessorCard({cpu, onAddToBuild}: ProcessorCardProps) {
    const [imageError, setImageError] = useState(false);

    const imageToShow = !imageError && cpu.image_url ? cpu.image_url : '/images/icons/gradient/processor.png';

    return (
        <div className="w-full min-w-64">
            <div className="border bg-sidebar rounded-lg p-4 shadow hover:shadow-lg transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/processors/${cpu.id}`}>
                        <span className="flex items-start">
                            <img
                                src={imageToShow}
                                alt={cpu.name}
                                className="w-12 h-12 object-contain rounded"
                                onError={() => setImageError(true)}
                            />
                            <h2 className="text-xl font-semibold mx-4">{cpu.manufacturer} {cpu.name}</h2>
                        </span>
                    </Link>

                </div>
                <div className="flex gap-2 items-center justify-between my-4 mx-2">
                    <p className="text-sm">{cpu.socket}</p>
                    <p className="text-sm">{cpu.cores} Cores</p>
                    <p className="text-sm">{cpu.base_clock} GHz</p>
                </div>
                <div className="flex justify-between items-center mb-2 mx-2">
                    <span className="text-l">Price </span>
                    <span className="text-l">€ {cpu.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-between p-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 text-purple-600 border-purple-600 hover:text-primary"
                            onClick={() => onAddToBuild(cpu)}>
                            Add to Build
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 px-4 py-1 rounded text-blue-600 border-blue-600 hover:text-primary">
                            <Link href={`/parts/processors/${cpu.id}`}>View Details</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}