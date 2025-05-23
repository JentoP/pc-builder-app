'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import PowerSupplyCard from '@/components/parts/PowerSupplyCard'
import { useBuild } from '@/hooks/useBuild'
import { toast } from 'sonner'

type PowerSupply = {
    id: string
    name: string
    manufacturer: string
    wattage: number
    efficiency_rating: string
    modular: boolean
    price: number
}

export default function PowerSuppliesPage() {
    const [powerSupplies, setPowerSupplies] = useState<PowerSupply[]>([])
    const [filtered, setFiltered] = useState<PowerSupply[]>([])
    const [loading, setLoading] = useState(true)
    const [efficiencyFilter, setEfficiencyFilter] = useState('All')
    const supabase = createClient()
    const { updateBuild } = useBuild()

    useEffect(() => {
        const fetchPowerSupplies = async () => {
            const { data, error } = await supabase.from('power_supplies').select('*')
            if (error) {
                console.error('Error fetching power supplies:', error.message)
            } else {
                setPowerSupplies(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchPowerSupplies()
    }, [])

    const efficiencyOptions = ['All', ...Array.from(new Set(powerSupplies.map(p => p.efficiency_rating)))]

    const handleFilterChange = (efficiency: string) => {
        setEfficiencyFilter(efficiency)
        if (efficiency === 'All') {
            setFiltered(powerSupplies)
        } else {
            setFiltered(powerSupplies.filter(p => p.efficiency_rating === efficiency))
        }
    }

    const handleAddToBuild = (psu: PowerSupply) => {
        // adds the selected power supply to the current build, type is
        updateBuild('psu', psu)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Power Supplies</h1>

            <div className="mb-6">
                <label htmlFor="efficiencyFilter" className="block text-sm font-medium mb-2">
                    Filter by Efficiency Rating
                </label>
                <select
                    id="efficiencyFilter"
                    value={efficiencyFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border focus:border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-sidebar">
                >
                    {efficiencyOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-60 w-full rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(psu => (
                        <PowerSupplyCard key={psu.id} psu={psu} onAddToBuild={handleAddToBuild} />
                    ))}
                </div>
            )}
        </div>
    )
}
