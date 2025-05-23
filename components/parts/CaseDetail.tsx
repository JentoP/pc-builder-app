'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';

type Case = {
    id: string;
    name: string;
    manufacturer: string;
    mobo_form_factor: string;
    psu_form_factor: string;
    max_gpu_length: number;
    color?: string;
    side_panel: string;
    price: number;
    image_url?: string | null;
};

export default function CaseDetail({ pcCase }: { pcCase: Case }) {
    const [imageError, setImageError] = useState(false);
    const { updateBuild } = useBuild();

    const imageSrc = !imageError && pcCase.image_url
        ? pcCase.image_url
        : '/images/icons/gradient/case.png';

    const isAdmin = true; // Replace with your admin check logic

    return (
        <div className="bg-sidebar shadow rounded-lg p-6 border">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={pcCase.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div className="p-4 rounded-lg w-full">
                    <h1 className="text-2xl font-bold my-4">
                        {pcCase.manufacturer} {pcCase.name}
                    </h1>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Side Panel</span>
                            <span>{pcCase.side_panel}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Motherboard Form Factor</span>
                            <span>{pcCase.mobo_form_factor}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">PSU Form Factor</span>
                            <span>{pcCase.psu_form_factor}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Color</span>
                            <span>{pcCase.color}</span>
                        </div>
                        <div className="flex justify-between pt-3 text-xl font-semibold">
                            <span>Price</span>
                            <span>€ {pcCase.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('case', pcCase)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 border text-purple-600 border-purple-600 min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 border-blue-600 text-blue-600">
                    <a href={`https://www.google.com/search?q=${pcCase.name}`} target="_blank" rel="noopener noreferrer">
                        Search
                    </a>
                </Button>
            </div>
            {/* {isAdmin && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
                    <Button variant="secondary">
                        Edit Case
                    </Button>
                </div>
            )} */}
        </div>
    );
}
