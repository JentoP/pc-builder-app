'use client'

import {useEffect, useState} from 'react'
import {useRouter, useParams} from 'next/navigation'
import {createClient} from '@/utils/supabase/client'
import CaseDetail from '@/components/parts/CaseDetail'
import {Skeleton} from '@/components/ui/skeleton'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {ArrowLeft} from "lucide-react";

export default function CaseDetailPage() {
    const {id} = useParams()
    const supabase = createClient()
    const [caseData, setCaseData] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (!id) return
        const fetchCase = async () => {
            const {data, error} = await supabase.from('cases').select('*').eq('id', id).single()
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
        return <Skeleton className="h-60 w-full rounded-lg"/>
    }

    if (!caseData) {
        return <p className="text-center text-red-600">Case not found.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Button
                onClick={() => router.back()}
                variant="outline" size="icon" asChild>
                <ArrowLeft className="h-4 w-4"/>
            </Button>
            <CaseDetail pcCase={caseData}/>
            <div className="flex justify-center">
                <Link href="/parts/cases" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm"
                            className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        Back to Cases
                    </Button>
                </Link>
            </div>
        </div>
    )
}
