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
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={cpu.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{cpu.manufacturer} {cpu.name}</h1>
                    <p className=""><strong>Socket:</strong> {cpu.socket}</p>
                    <p className=""><strong>Cores:</strong> {cpu.cores}</p>
                    <p className=""><strong>Threads:</strong> {cpu.threads}</p>
                    <p className=""><strong>Base Clock:</strong> {cpu.base_clock} GHz</p>
                    <p className=""><strong>Boost Clock:</strong> {cpu.boost_clock} GHz</p>
                    <p className=""><strong>TDP:</strong> {cpu.tdp} W</p>
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {cpu.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">

                <Button onClick={() => updateBuild('processor', cpu)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 text-purple-600 hover:border-purple-700 hover:text-purple-700">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 text-blue-600 hover:border-blue-700 hover:text-blue-700">
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
