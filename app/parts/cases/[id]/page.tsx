'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import CaseDetail from '@/components/parts/CaseDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CaseDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [caseData, setCaseData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        const fetchCase = async () => {
            const { data, error } = await supabase.from('cases').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: case not found")
                setCaseData(null)
            } else {
                setCaseData(data)
            }
            setLoading(false)
        }
        fetchCase()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg" />
    }

    if (!caseData) {
        return <p className="text-center text-red-600">Case not found.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <CaseDetail pcCase={caseData} />
            <div className="flex justify-center">
                <Link href="/parts/cases" className="w-auto mt-3 px-4 py-1 rounded text-blue-600 border-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Button variant="outline" size="sm">
                        Back to Cases
                    </Button>
                </Link>
            </div>
        </div>
    )
}
