'use client'

import { useBuild } from '@/hooks/useBuild'
import {Button} from "@/components/ui/button";

export default function BuildDisplay() {
    const { build, clearPart } = useBuild()

    return (
        <div className="space-y-4">
            {Object.entries(build).map(([key, part]) => (
                <div
                    key={key}
                    className="border rounded p-4 flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold capitalize">{key}</p>
                        {part ? (
                            <p>{part.name}</p>
                        ) : (
                            <p className="text-sm text-gray-500">Not selected</p>
                        )}
                    </div>
                    {part && (
                        <Button onClick={() => clearPart(key as any)}>Remove</Button>
                    )}
                </div>
            ))}
        </div>
    );
}