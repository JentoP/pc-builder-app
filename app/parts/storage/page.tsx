'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import StorageCard from '@/components/parts/StorageCard'
import { useBuild } from '@/hooks/useBuild'

type Storage = {
    id: string
    name: string
    manufacturer: string
    type: string
    capacity: number
    interface: string
    price: number
}

export default function StoragePage() {
    const [storageList, setStorageList] = useState<Storage[]>([])
    const [filtered, setFiltered] = useState<Storage[]>([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState('All')
    const [itemsToShow, setItemsToShow] = useState(9)
    const supabase = createClient()
    const { updateBuild } = useBuild()

    useEffect(() => {
        const fetchStorage = async () => {
            const { data, error } = await supabase.from('storage').select('*')
            if (error) {
                console.error('Error fetching storage:', error.message)
            } else {
                setStorageList(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchStorage()
    }, [])

    const typeOptions = ['All', ...Array.from(new Set(storageList.map(s => s.type)))]

    const handleFilterChange = (type: string) => {
        setTypeFilter(type)
        setItemsToShow(9)
        if (type === 'All') {
            setFiltered(storageList)
        } else {
            setFiltered(storageList.filter(s => s.type === type))
        }
    }

    const handleAddToBuild = (drive: Storage) => {
        updateBuild('storage', drive)
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Storage Drives</h1>

            <div className="my-6 mr-8">
                <label htmlFor="typeFilter" className="block text-sm font-medium mb-2">
                    Filter by Type
                </label>
                <select
                    id="typeFilter"
                    value={typeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border focus:border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-sidebar">
                    {typeOptions.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-60 w-full rounded-lg" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.slice(0, itemsToShow).map(drive => (
                            <StorageCard key={drive.id} drive={drive} onAddToBuild={handleAddToBuild} />
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
