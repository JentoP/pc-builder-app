'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Processor = {
    id: string
    name: string
    price: number
}

export default function EditProcessorPricePage() {
    const supabase = createClient()

    const [processors, setProcessors] = useState<Processor[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [newPrice, setNewPrice] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string>('')

    // Fetch processors
    useEffect(() => {
        async function fetchProcessors() {
            setLoading(true)
            const { data, error } = await supabase.from('processors').select('id, name, price')
            if (error) {
                setMessage(`Error loading processors: ${error.message}`)
            } else {
                setProcessors(data || [])
            }
            setLoading(false)
        }
        fetchProcessors()
    }, [supabase])

    // When selected changes, update the input value
    useEffect(() => {
        if (selectedId) {
            const proc = processors.find(p => p.id === selectedId)
            setNewPrice(proc ? proc.price.toString() : '')
        }
    }, [selectedId, processors])

    const handleUpdate = async () => {
        if (!selectedId || newPrice.trim() === '') {
            setMessage('Please select a processor and enter a price')
            return
        }
        const priceNum = Number(newPrice)
        if (isNaN(priceNum) || priceNum < 0) {
            setMessage('Please enter a valid positive number for price')
            return
        }

        setLoading(true)
        const { error } = await supabase.from('processors').update({ price: priceNum }).eq('id', selectedId)
        if (error) {
            setMessage(`Update failed: ${error.message}`)
        } else {
            setMessage('Price updated successfully!')
            // Optionally update local state to reflect change immediately
            setProcessors(processors.map(p => p.id === selectedId ? { ...p, price: priceNum } : p))
        }
        setLoading(false)
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Processor Price</h1>

            {loading && <p>Loading...</p>}
            {message && <p className="mb-4 text-red-600">{message}</p>}

            <label htmlFor="processor-select" className="block mb-1 font-semibold">Select Processor:</label>
            <select
                id="processor-select"
                value={selectedId || ''}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
            >
                <option value="">-- Select Processor --</option>
                {processors.map(proc => (
                    <option key={proc.id} value={proc.id}>{proc.name}</option>
                ))}
            </select>

            {selectedId && (
                <>
                    <label htmlFor="price-input" className="block mb-1 font-semibold">New Price ($):</label>
                    <input
                        id="price-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newPrice}
                        onChange={e => setNewPrice(e.target.value)}
                        className="w-full mb-4 p-2 border rounded"
                    />

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Update Price
                    </button>
                </>
            )}
        </div>
    )
}