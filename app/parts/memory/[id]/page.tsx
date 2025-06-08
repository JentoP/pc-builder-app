'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import MemoryDetail from '@/components/parts/MemoryDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react";

export default function MemoryDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [memory, setMemory] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

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
        return <Skeleton className="h-60 w-full rounded-lg"/>
    }

    if (!memory) {
        return <p className="text-center text-red-600">Memory not found.</p>
    }

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Button variant="secondary" size="icon" className="size-8 mr-2" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">
                    Memory Details
                </h1>
            </div>
            <MemoryDetail memory={memory}/>
            <div className="flex justify-center">
                <Link href="/parts/memory" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm"
                            className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        View All Memory
                    </Button>
                </Link>
            </div>
        </div>
    )
}
