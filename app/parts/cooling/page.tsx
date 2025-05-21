'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import CoolerCard from '@/components/parts/CoolingCard'
import { useBuild } from '@/hooks/useBuild'
import { toast } from 'sonner'

type Cooler = {
    id: string
    name: string
    manufacturer: string
    type: string // e.g., Air, AIO
    supported_sockets: string[]
    noise_level: number
    price: number
}

export default function CoolingPage() {
    const [coolers, setCoolers] = useState<Cooler[]>([])
    const [filtered, setFiltered] = useState<Cooler[]>([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState('All')
    const supabase = createClient()
    const { updateBuild } = useBuild()

    useEffect(() => {
        const fetchCoolers = async () => {
            const { data, error } = await supabase.from('coolers').select('*')
            if (error) {
                console.error('Error fetching coolers:', error.message)
            } else {
                setCoolers(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchCoolers()
    }, [])

    const coolerTypes = ['All', ...Array.from(new Set(coolers.map(c => c.type)))]

    const handleFilterChange = (value: string) => {
        setTypeFilter(value)
        if (value === 'All') {
            setFiltered(coolers)
        } else {
            setFiltered(coolers.filter(c => c.type === value))
        }
    }

    const handleAddToBuild = (cooler: Cooler) => {
        updateBuild('cooling', cooler)
        toast.success(`${cooler.name} added to current build!`)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">CPU Coolers</h1>

            {/* Filter */}
            <div className="mb-6">
                <label htmlFor="typeFilter" className="block text-sm font-medium mb-2">
                    Filter by Type
                </label>
                <select
                    id="typeFilter"
                    value={typeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                    {coolerTypes.map(type => (
                        <option key={type} value={type}>
                            {type}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(cooler => (
                        <CoolerCard key={cooler.id} cooler={cooler} onAddToBuild={handleAddToBuild} />
                    ))}
                </div>
            )}
        </div>
    )
}
