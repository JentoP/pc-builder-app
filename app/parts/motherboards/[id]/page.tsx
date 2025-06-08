'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import MotherboardDetail from '@/components/parts/MotherboardDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react";

export default function MotherboardDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [motherboard, setMotherboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (!id) return
        const fetchMotherboard = async () => {
            const { data, error } = await supabase.from('motherboards').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: motherboard not found")
                setMotherboard(null)
            } else {
                setMotherboard(data)
            }
            setLoading(false)
        }
        fetchMotherboard()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg" />
    }

    if (!motherboard) {
        return <p className="text-center text-red-600">Motherboard not found.</p>
    }

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Button variant="secondary" size="icon" className="size-8 mr-2" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">
                    Motherboard Details
                </h1>
            </div>
            <MotherboardDetail motherboard={motherboard} />
            <div className="flex justify-center">
                <Link href="/parts/motherboards" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm"
                            className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        View All Motherboards
                    </Button>
                </Link>
            </div>
        </div>
    )
}
