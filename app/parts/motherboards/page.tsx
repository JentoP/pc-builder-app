'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Motherboard = {
    id: string;
    name: string;
    manufacturer: string;
    chipset: string;
    socket: string;
    form_factor: string;
    memory_type: string;
    memory_slots: number;
    max_memory: number;
    price: number;
};

export default function MotherboardsPage() {
    const [motherboards, setMotherboards] = useState<Motherboard[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchMotherboards = async () => {
            const { data, error } = await supabase.from('motherboards').select('*');
            if (error) {
                console.error('Error fetching motherboards:', error.message);
            } else {
                setMotherboards(data || []);
            }
            setLoading(false);
        };

        fetchMotherboards();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Motherboards</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="bg-neutral-900">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Manufacturer</th>
                        <th className="border p-2">Chipset</th>
                        <th className="border p-2">Socket</th>
                        <th className="border p-2">Form Factor</th>
                        <th className="border p-2">Memory Type</th>
                        <th className="border p-2">Slots</th>
                        <th className="border p-2">Max Memory (GB)</th>
                        <th className="border p-2">Price ($)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {motherboards.map((mb) => (
                        <tr key={mb.id}>
                            <td className="border p-2">{mb.name}</td>
                            <td className="border p-2">{mb.manufacturer}</td>
                            <td className="border p-2">{mb.chipset}</td>
                            <td className="border p-2">{mb.socket}</td>
                            <td className="border p-2">{mb.form_factor}</td>
                            <td className="border p-2">{mb.memory_type}</td>
                            <td className="border p-2">{mb.memory_slots}</td>
                            <td className="border p-2">{mb.max_memory}</td>
                            <td className="border p-2">${mb.price.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
