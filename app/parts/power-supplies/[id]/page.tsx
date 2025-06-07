'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import PowerSupplyDetail from '@/components/parts/PowerSupplyDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react";

export default function PowerSupplyDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [powerSupply, setPowerSupply] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (!id) return
        const fetchPowerSupply = async () => {
            const { data, error } = await supabase.from('power_supplies').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: power supply not found")
                setPowerSupply(null)
            } else {
                setPowerSupply(data)
            }
            setLoading(false)
        }
        fetchPowerSupply()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg"/>
    }

    if (!powerSupply) {
        return <p className="text-center text-red-600">Power supply not found.</p>
    }

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Button
                    onClick={() => router.back()}
                    variant="outline" size="icon" asChild>
                    <ArrowLeft className="h-4 w-4"/>
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">
                    Power Supply Details
                </h1>
            </div>
            <PowerSupplyDetail psu={powerSupply}/>
            <div className="flex justify-center">
                <Link href="/parts/power-supplies" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm"
                            className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        View All Power Supplies
                    </Button>
                </Link>
            </div>
        </div>
    )
}
