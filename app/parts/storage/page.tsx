'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import StorageCard from '@/components/parts/StorageCard'
import { useBuild } from '@/hooks/useBuild'
import { toast } from 'sonner'

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
            <h1 className="text-2xl font-bold mb-6">Storage Devices</h1>

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
                    {typeOptions.map(type => (
                        <option key={type} value={type}>
                            {type}
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
                    {filtered.map(drive => (
                        <StorageCard key={drive.id} drive={drive} onAddToBuild={handleAddToBuild} />
                    ))}
                </div>
            )}
        </div>
    )
}
