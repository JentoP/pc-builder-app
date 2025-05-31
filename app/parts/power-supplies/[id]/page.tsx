'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import PowerSupplyDetail from '@/components/parts/PowerSupplyDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PowerSupplyDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [powerSupply, setPowerSupply] = useState(null)
    const [loading, setLoading] = useState(true)

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
        return <Skeleton className="h-60 w-full rounded-lg" />
    }

    if (!powerSupply) {
        return <p className="text-center text-red-600">Power Supply not found.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <PowerSupplyDetail psu={powerSupply} />
            <div className="flex justify-center">
                <Link href="/parts/power-supplies" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm" className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        Back to Power Supplies
                    </Button>
                </Link>
            </div>
        </div>
    )
}
