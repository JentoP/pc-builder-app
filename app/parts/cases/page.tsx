'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import CaseCard from '@/components/parts/CaseCard'
import { useBuild } from '@/hooks/useBuild'

type Case = {
    id: string
    name: string
    manufacturer: string
    mobo_form_factor: string
    psu_form_factor: string
    max_gpu_length: number
    color?: string
    side_panel: string
    price: number
    image_url?: string | null
}

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([])
    const [filtered, setFiltered] = useState<Case[]>([])
    const [loading, setLoading] = useState(true)
    const [formFactorFilter, setFormFactorFilter] = useState('All')
    const supabase = createClient()
    const { updateBuild } = useBuild()

    useEffect(() => {
        const fetchCases = async () => {
            const { data, error } = await supabase.from('cases').select('*')
            if (error) {
                console.error('Error fetching cases:', error.message)
            } else {
                setCases(data || [])
                setFiltered(data || [])
            }
            setLoading(false)
        }
        fetchCases()
    }, [])

    const formFactors = ['All', ...Array.from(new Set(cases.map(c => c.mobo_form_factor)))]

    const handleFilterChange = (value: string) => {
        setFormFactorFilter(value)
        if (value === 'All') {
            setFiltered(cases)
        } else {
            setFiltered(cases.filter(c => c.mobo_form_factor === value))
        }
    }

    const handleAddToBuild = (pcCase: Case) => {
        updateBuild('case', pcCase)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">PC Cases</h1>

            {/* Filter */}
            <div className="mb-6">
                <label htmlFor="formFactorFilter" className="block text-sm font-medium mb-2">
                    Filter by Form Factor
                </label>
                <select
                    id="formFactorFilter"
                    value={formFactorFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                    {formFactors.map(option => (
                        <option key={`form-factor-${option}`} value={option}>
                            {option}
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
                    {filtered.map(pcCase => (
                        <CaseCard key={pcCase.id} pcCase={pcCase} onAddToBuild={handleAddToBuild} />
                    ))}
                </div>
            )}
        </div>
    )
}
