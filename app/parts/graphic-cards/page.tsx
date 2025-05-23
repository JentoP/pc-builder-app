'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import GpuCard from '@/components/parts/GpuCard'
import { useBuild } from '@/hooks/useBuild'
import { toast } from 'sonner'

type GraphicCard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    memory_size: number;
    memory_type: string;
    length_mm: number;
    nr_of_cores: number;
    core_clock_mhz: number;
    tdp: number;
    price: number;
    image_url?: string | null;
}

export default function GraphicCardsPage() {
    const [cards, setCards] = useState<GraphicCard[]>([])
    const [filtered, setFiltered] = useState<GraphicCard[]>([])
    const [loading, setLoading] = useState(true)
    const [chipsetFilter, setChipsetFilter] = useState('All')
    const supabase = createClient()
    const { updateBuild } = useBuild()

    useEffect(() => {
        const fetchCards = async () => {
            const { data, error } = await supabase.from('graphic_cards').select('*')
            if (error) {
                console.error('Error fetching graphic cards:', error.message)
            } else {
                setCards(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchCards()
    }, [])

    const chipsetOptions: string[] = ['All', ...Array.from(new Set(cards.map(c => c.chipset)))]

    const handleFilterChange = (chipset: string) => {
        setChipsetFilter(chipset)
        if (chipset === 'All') {
            setFiltered(cards)
        } else {
            setFiltered(cards.filter(c => c.chipset === chipset))
        }
    }

    const handleAddToBuild = (gpu: GraphicCard) => {
        updateBuild('gpu', gpu)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Graphic Cards</h1>

            {/* Filter */}
            <div className="mb-6">
                <label htmlFor="chipsetFilter" className="block text-sm font-medium mb-2">
                    Filter by Chipset
                </label>
                <select
                    id="chipsetFilter"
                    value={chipsetFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500">
                    {chipsetOptions.map(chipset => (
                        <option key={chipset} value={chipset}>
                            {chipset}
                        </option>
                    ))}
                </select>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-60 w-full rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-200 hover:shadow-lg">
                    {filtered.map(gpu => (
                        <GpuCard key={gpu.id} gpu={gpu} onAddToBuild={handleAddToBuild} />
                    ))}
                </div>
            )}
        </div>
    )
}
