'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBuild } from '@/hooks/useBuild';
import Link from 'next/link';

type Case = {
    id: string;
    name: string;
    manufacturer: string;
    side_panel: string;
    mobo_form_factor: string;
    psu_form_factor: string;
    color: string;
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
        <div className="shadow rounded-lg p-6 border hover:border-purple-700">
            <div className="flex items-start gap-4">
                <img
                    src={imageSrc}
                    alt={pcCase.name}
                    className="w-24 h-24 object-contain"
                    onError={() => setImageError(true)}
                />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{pcCase.manufacturer} {pcCase.name}</h1>
                    <p><strong>Side Panel:</strong> {pcCase.side_panel}</p>
                    <p><strong>Motherboard Form Factor:</strong> {pcCase.mobo_form_factor}</p>
                    <p><strong>PSU Form Factor:</strong> {pcCase.psu_form_factor}</p>
                    <p><strong>Color:</strong> {pcCase.color}</p>
                    <p className="text-xl font-semibold mt-4 mb-3"><strong>Price:</strong> € {pcCase.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between pt-4 border-t">
                <Link href={`/builds/new`}
                      onClick={(e) => {
                          e.preventDefault();
                          updateBuild('case', pcCase);
                      }}
                      className="w-full">
                    <Button variant="outline" size="sm">
                        Add to Build
                    </Button>
                </Link>
                {isAdmin && (
                    <Link href={`/admin/parts/${pcCase.id}/edit`} className="w-full">
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </Link>
                )}
            </div>
            {/* {isAdmin && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Admin Controls</h2>
          <Button variant="secondary">Edit Case</Button>
        </div>
      )} */}
        </div>
    );
}
