'use client'

import {useEffect, useState} from 'react'
import {useRouter, useParams} from 'next/navigation'
import {createClient} from '@/utils/supabase/client'
import ProcessorDetail from '@/components/parts/ProcessorDetail'
import {Skeleton} from '@/components/ui/skeleton'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {ArrowLeft} from "lucide-react";

export default function ProcessorDetailPage() {
    const {id} = useParams() // get id from route params
    const supabase = createClient()
    const [cpu, setCpu] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (!id) return
        const fetchCpu = async () => {
            const {data, error} = await supabase.from('processors').select('*').eq('id', id).single()
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
        return <Skeleton className="h-60 w-full rounded-lg"/>
    }

    if (!cpu) {
        return <p className="text-center text-red-600">Processor not found.</p>
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
                    Processor Details
                </h1>
            </div>
            <ProcessorDetail cpu={cpu}/>
            <div className="flex justify-center">
                <Link href="/parts/processors" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm"
                            className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        View All Processors
                    </Button>
                </Link>
            </div>
        </div>
    )
}
