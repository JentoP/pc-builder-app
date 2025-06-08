'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import MotherboardCard from '@/components/parts/MotherboardCard'
import { useBuild } from '@/hooks/useBuild'

type Motherboard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    socket: string;
    form_factor: string;
    memory_slots: number;
    max_memory: number;
    memory_type: string;
    sata_ports: number;
    nvme_ports: number;
    price: number;
    image_url?: string | null;
}

export default function MotherboardsPage() {
    const [motherboards, setMotherboards] = useState<Motherboard[]>([])
    const [filtered, setFiltered] = useState<Motherboard[]>([])
    const [loading, setLoading] = useState(true)
    const [socketFilter, setSocketFilter] = useState('All')
    const [itemsToShow, setItemsToShow] = useState(9)
    const supabase = createClient()
    const { updateBuild } = useBuild()

    useEffect(() => {
        const fetchMotherboards = async () => {
            const { data, error } = await supabase.from('motherboards').select('*')
            if (error) {
                console.error('Error fetching motherboards:', error.message)
            } else {
                setMotherboards(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchMotherboards()
    }, [])

    const socketOptions: string[] = ['All', ...Array.from(new Set(motherboards.map(m => m.socket)))]

    const handleFilterChange = (socket: string) => {
        setSocketFilter(socket)
        setItemsToShow(9)
        if (socket === 'All') {
            setFiltered(motherboards)
        } else {
            setFiltered(motherboards.filter(m => m.socket === socket))
        }
    }

    const handleAddToBuild = (mobo: Motherboard) => {
        updateBuild('motherboard', mobo)
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Motherboards</h1>

            {/* Filter */}
            <div className="mb-6">
                <label htmlFor="socketFilter" className="block text-sm font-medium mb-2">
                    Filter by Socket
                </label>
                <select
                    id="socketFilter"
                    value={socketFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border focus:border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-sidebar">
                    {socketOptions.map(socket => (
                        <option key={socket} value={socket}>
                            {socket}
                        </option>
                    ))}
                </select>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-60 w-full rounded-lg" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.slice(0, itemsToShow).map(mobo => (
                            <MotherboardCard key={mobo.id} motherboard={mobo} onAddToBuild={handleAddToBuild} />
                        ))}
                    </div>
                    {itemsToShow < filtered.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setItemsToShow(prev => prev + 9)}
                                className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white px-6 py-2 rounded-md transition-colors"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
