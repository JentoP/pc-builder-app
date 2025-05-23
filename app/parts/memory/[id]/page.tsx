'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import MemoryDetail from '@/components/parts/MemoryDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MemoryDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [memory, setMemory] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        const fetchMemory = async () => {
            const { data, error } = await supabase.from('memory').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: memory not found")
                setMemory(null)
            } else {
                setMemory(data)
            }
            setLoading(false)
        }
        fetchMemory()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg" />
    }

    if (!memory) {
        return <p className="text-center text-red-600">Memory not found.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <MemoryDetail ram={memory} />
            <div className="flex justify-center">
                <Link href="/parts/memory" className="w-auto mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Button variant="outline" size="sm">
                        Back to Memory
                    </Button>
                </Link>
            </div>
        </div>
    )
}
