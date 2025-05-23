// MemoryPage.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import MemoryCard from '@/components/parts/MemoryCard'
import { useBuild } from '@/hooks/useBuild'
import { toast } from 'sonner'

type Memory = {
    id: string
    name: string
    manufacturer: string
    type: string
    size: number
    speed: number
    modules: number
    price: number
    image_url?: string | null
}

export default function MemoryPage() {
    const [memoryModules, setMemoryModules] = useState<Memory[]>([])
    const [filtered, setFiltered] = useState<Memory[]>([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState('All')
    const supabase = createClient()
    const {updateBuild} = useBuild()

    useEffect(() => {
        const fetchMemory = async () => {
            const {data, error} = await supabase.from('memory').select('*')
            if (error) {
                console.error('Error fetching memory:', error.message)
            } else {
                setMemoryModules(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchMemory()
    }, [])

    const typeOptions: string[] = ['All', ...Array.from(new Set(memoryModules.map(m => m.type)))]

    const handleFilterChange = (type: string) => {
        setTypeFilter(type)
        if (type === 'All') {
            setFiltered(memoryModules)
        } else {
            setFiltered(memoryModules.filter(m => m.type === type))
        }
    }

    const handleAddToBuild = (ram: Memory) => {
        updateBuild('memory', ram)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Memory</h1>

            {/* Filter */}
            <div className="mb-6">
                <label htmlFor="typeFilter" className="block text-sm font-medium mb-2">
                    Filter by Type
                </label>
                <select
                    id="typeFilter"
                    value={typeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500">
                    {typeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-60 w-full rounded-lg"/>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(ram => (
                        <MemoryCard key={ram.id} memory={ram} onAddToBuild={handleAddToBuild}/>
                    ))}
                </div>
            )}
        </div>
    )
}