'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import GraphicCardDetail from '@/components/parts/GraphicCardDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from "lucide-react";

export default function GraphicCardDetailPage() {
    const { id } = useParams()
    const supabase = createClient()
    const [card, setCard] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (!id) return
        const fetchCard = async () => {
            const { data, error } = await supabase.from('graphic_cards').select('*').eq('id', id).single()
            if (error) {
                console.error("Error: graphic card not found")
                setCard(null)
            } else {
                setCard(data)
            }
            setLoading(false)
        }
        fetchCard()
    }, [id, supabase])

    if (loading) {
        return <Skeleton className="h-60 w-full rounded-lg"/>
    }

    if (!card) {
        return <p className="text-center text-red-600">Graphic Card not found.</p>
    }

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/parts/graphic-cards">
                        <ArrowLeft className="h-4 w-4"/>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold flex-1 text-center">
                    Graphic Card Details
                </h1>
            </div>
            <GraphicCardDetail card={card}/>
            <div className="flex justify-center">
                <Link href="/parts/graphic-cards" className="w-auto mt-3 px-4 py-1 rounded">
                    <Button variant="outline" size="sm"
                            className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white">
                        View All Graphic Cards
                    </Button>
                </Link>
            </div>
        </div>
    )
}
