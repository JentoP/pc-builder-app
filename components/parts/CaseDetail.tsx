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
            <div className="flex items-start gap-6 mb-6">
                <img
                    src={imageSrc}
                    alt={pcCase.name}
                    className="w-32 h-32 object-contain"
                    onError={() => setImageError(true)}
                />
                <h1 className="text-2xl font-bold pt-2">
                    {pcCase.manufacturer} {pcCase.name}
                </h1>
            </div>
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
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={() => updateBuild('case', pcCase)}
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 rounded border-purple-800 hover:bg-purple-800 hover:text-white text-primary bg-sidebar min-w-24">
                    Add to Build
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar min-w-24">
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
