'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import MotherboardDetail from '@/components/parts/MotherboardDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MotherboardDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [motherboard, setMotherboard] = useState(null)
    const [loading, setLoading] = useState(true)

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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <MotherboardDetail motherboard={motherboard} />
            <div className="flex justify-center">
                <Link href="/parts/motherboards" className="w-auto mt-3 px-4 py-1 rounded text-blue-600 border-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Button variant="outline" size="sm">
                        Back to Motherboards
                    </Button>
                </Link>
            </div>
        </div>
    )
}
