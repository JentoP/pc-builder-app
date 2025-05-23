'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import CoolerDetail from '@/components/parts/CoolerDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CoolerDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [cooler, setCooler] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        const fetchCooler = async () => {
            const { data, error } = await supabase.from('coolers').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: cooler not found")
                setCooler(null)
            } else {
                setCooler(data)
            }
            setLoading(false)
        }
        fetchCooler()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg" />
    }

    if (!cooler) {
        return <p className="text-center text-red-600">Cooler not found.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <CoolerDetail cooler={cooler} />
            <div className="flex justify-center">
                <Link href="/parts/cooling" className="w-auto mt-3 px-4 py-1 rounded text-blue-600 border-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Button variant="outline" size="sm">
                        Back to Coolers
                    </Button>
                </Link>
            </div>
        </div>
    )
}
