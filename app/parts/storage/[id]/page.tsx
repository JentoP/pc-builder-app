'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import StorageDetail from '@/components/parts/StorageDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react";

export default function StorageDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [storage, setStorage] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (!id) return
        const fetchStorage = async () => {
            const { data, error } = await supabase.from('storage').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: storage not found")
                setStorage(null)
            } else {
                setStorage(data)
            }
            setLoading(false)
        }
        fetchStorage()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg"/>
    }

    if (!storage) {
        return <p className="text-center text-red-600">Storage not found.</p>
    }

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/parts/storage">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">
                    Storage Details
                </h1>
            </div>
            <StorageDetail storage={storage}/>
            <div className="flex justify-center">
                <Link href="/parts/storage" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm"
                            className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        View All Storage
                    </Button>
                </Link>
            </div>
        </div>
    )
}
