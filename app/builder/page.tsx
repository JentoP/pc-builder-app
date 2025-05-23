'use client'

import {useRouter} from 'next/navigation'
import {Build, useBuild} from '@/hooks/useBuild'
import BuildDisplay from "@/components/BuildDisplay";

const routeMap: Record<keyof Build, string> = {
    name: 'builds',
    processor: 'processors',
    motherboard: 'motherboards',
    memory: 'memory',
    gpu: 'graphic-cards',
    storage: 'storage',
    psu: 'power-supplies',
    case: 'cases',
    cooling: 'cooling',
}

export default function BuilderPage() {
    const {build, clearPart} = useBuild()
    const router = useRouter()

    const builderRow = (
        label: string,
        partKey: keyof typeof build,
        showValue: (part: any) => string
    ) => (
        <div className="mb-4">
            <p className="font-semibold">{label}:</p>
            {build[partKey] ? (
                <div className="border p-2 rounded bg-gray-100">
                    {showValue(build[partKey])}
                </div>
            ) : (
                <p className="text-gray-500">No {label.toLowerCase()} selected</p>
            )}
            <div className="flex gap-2 mt-2">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => router.push(`/parts/${routeMap[partKey]}`)}
                >
                    Choose {label}
                </button>
                {build[partKey] && (
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => clearPart(partKey)}
                    >
                        Remove {label}
                    </button>
                )}
            </div>
        </div>
    )

    return (
        <div className="p-4 mb-32">
            <h1 className="text-2xl font-bold mb-6">Build Your PC</h1>
            <p className="text-muted-foreground mb-4">
                This builder can help you create the perfect PC setup for your needs.
                As you select components, the builder checks compatibility for you.
                If you need more information, please visit the getting started page.
            </p>
            <BuildDisplay/>
        </div>
    )
}
