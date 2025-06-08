'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import ProcessorCard from '@/components/parts/ProcessorCard'
import { useBuild } from '@/hooks/useBuild'
import { ArrowBigDownDash } from 'lucide-react'

type Processor = {
    id: string
    name: string
    manufacturer: string
    socket: string
    cores: number
    threads: number
    base_clock: number
    boost_clock: number
    tdp: number
    price: number
}

export default function ProcessorsPage() {
    const [processors, setProcessors] = useState<Processor[]>([])
    const [filtered, setFiltered] = useState<Processor[]>([])
    const [loading, setLoading] = useState(true)
    const [socketFilter, setSocketFilter] = useState('All')
    const [itemsToShow, setItemsToShow] = useState(9)
    const supabase = createClient()
    const { updateBuild } = useBuild();

    useEffect(() => {
        const fetchProcessors = async () => {
            const { data, error } = await supabase.from('processors').select('*')
            if (error) {
                console.error('Error fetching processors:', error.message)
            } else {
                setProcessors(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchProcessors()
    }, [])

    const socketOptions: string[] = ['All', ...Array.from(new Set(processors.map(p => p.socket)))]

    const handleFilterChange = (socket: string) => {
        setSocketFilter(socket)
        setItemsToShow(8)
        if (socket === 'All') {
            setFiltered(processors)
        } else {
            setFiltered(processors.filter(p => p.socket === socket))
        }
    }
    const handleAddToBuild = (cpu: Processor) => {
        updateBuild('processor', cpu);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Processors</h1>

            {/* Filter */}
            <div className="my-6 mr-8">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filtered.slice(0, itemsToShow).map(cpu => (
                            <ProcessorCard key={cpu.id} cpu={cpu} onAddToBuild={handleAddToBuild} />
                        ))}
                    </div>
                    {itemsToShow < filtered.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setItemsToShow(prev => prev + 9)}
                                className="bg-sidebar text-primary border border-blue-800 hover:bg-blue-800 hover:text-white px-6 py-2 rounded-md transition-colors">
                                <ArrowBigDownDash />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}