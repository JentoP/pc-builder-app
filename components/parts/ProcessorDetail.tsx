'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {useBuild} from '@/hooks/useBuild';

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

export default function ProcessorDetail({cpu}: { cpu: Processor }) {
    const [imageError, setImageError] = useState(false);
    const {updateBuild} = useBuild();

    const imageSrc = !imageError && cpu.image_url ? cpu.image_url : '/images/icons/gradient/processor.png';

    const isAdmin = true; // replace with your admin logic

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={cpu.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div className="p-4 rounded-lg w-full">
                    <h1 className="text-2xl font-bold my-4">
                        {cpu.manufacturer} {cpu.name}
                    </h1>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Socket</span>
                            <span>{cpu.socket}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Cores</span>
                            <span>{cpu.cores}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Threads</span>
                            <span>{cpu.threads}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Base Clock</span>
                            <span>{cpu.base_clock} GHz</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Boost Clock</span>
                            <span>{cpu.boost_clock} GHz</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Max Wattage</span>
                            <span>{cpu.tdp} W</span>
                        </div>
                        <div className="flex justify-between pt-3 text-xl font-semibold">
                            <span>Price</span>
                            <span>€ {cpu.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">

                <Button onClick={() => updateBuild('processor', cpu)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 border text-purple-600 border-purple-600 min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 border-blue-600 text-blue-600">
                    <a href={`https://www.google.com/search?q=${cpu.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/*{isAdmin && (*/}
            {/*    <div className="mt-6 border-t pt-4">*/}
            {/*        <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>*/}
            {/*        <Button variant="secondary">*/}
            {/*            Edit Processor*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}
