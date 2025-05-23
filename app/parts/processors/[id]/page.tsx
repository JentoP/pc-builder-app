'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import ProcessorDetail from '@/components/parts/ProcessorDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProcessorDetailPage() {
    const { id } = useParams() // get id from route params
    const supabase = createClient()
    const [cpu, setCpu] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        const fetchCpu = async () => {
            const { data, error } = await supabase.from('processors').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: processor not found")
                setCpu(null)
            } else {
                setCpu(data)
            }
            setLoading(false)
        }
        fetchCpu()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg" />
    }

    if (!cpu) {
        return <p className="text-center text-red-600">Processor not found.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <ProcessorDetail cpu={cpu} />
            <div className="flex justify-center">
                <Link href="/parts/processors" className="w-auto mt-3 px-4 py-1 rounded text-blue-600 border-blue-700 hover:text-primary">
                    <Button variant="outline" size="sm">
                        Back to Processors
                    </Button>
                </Link>
            </div>
        </div>
    )
}
