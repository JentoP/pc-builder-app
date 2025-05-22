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
        <div className="w-full">
            <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 items-center">
                <div className="flex gap-3">
                    <Link href={`/parts/processors/${cpu.id}`}>
                        <span className="flex items-start">
                            <img
                                src={imageToShow}
                                alt={cpu.name}
                                className="w-12 h-12 object-contain rounded"
                                onError={() => setImageError(true)}
                            />
                            <h2 className="text-xl font-semibold ml-2">{cpu.manufacturer} {cpu.name}</h2>
                        </span>
                    </Link>

                </div>
                <div className="flex gap-2 items-center justify-between m-3">
                    <p className="text-l mb-2">{cpu.socket}</p>
                    <p className="text-l mb-2">{cpu.cores} Cores</p>
                    <p className="text-l mb-2">{cpu.base_clock} GHz</p>
                </div>
                <div className="flex justify-between items-center m-3">
                    <span className="font-semibold text-l">Price:</span>
                    <span className="font-semibold text-l">€ {cpu.price.toFixed(2)}</span>
                </div>
                {onAddToBuild && (
                    <div className="flex justify-center">
                        <Button className="mt-3 px-4 py-1 rounded" onClick={() => onAddToBuild(cpu)}>
                            Add to Build
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}