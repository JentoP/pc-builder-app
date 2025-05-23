'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import StorageDetail from '@/components/parts/StorageDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function StorageDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [storage, setStorage] = useState(null)
    const [loading, setLoading] = useState(true)

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
        return <Skeleton className="h-60 w-full rounded-lg" />
    }

    if (!storage) {
        return <p className="text-center text-red-600">Storage not found.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <StorageDetail storage={storage} />
            <div className="flex justify-center">
                <Link href="/parts/storage" className="w-auto mt-3 px-4 py-1 rounded text-blue-600 border-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Button variant="outline" size="sm">
                        Back to Storage
                    </Button>
                </Link>
            </div>
        </div>
    )
}
