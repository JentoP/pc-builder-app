'use client';
import {useEffect, useState} from 'react';
import {createClient} from '@/utils/supabase/client';

type Processor = {
    id: string;
    name: string;
    manufacturer: string;
    socket: string;
    cores: number;
    threads: number;
    base_clock: number;
    boost_clock: number;
    tdp: number;
    price: number;
};

export default function ProcessorsPage() {
    const [processors, setProcessors] = useState<Processor[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient(); // get the usable instance

    useEffect(() => {
        const fetchProcessors = async () => {
            const {data, error} = await supabase.from('processors').select('*'); // ✅ now use it
            if (error) {
                console.error('Error fetching processors:', error.message);
            } else {
                setProcessors(data || []);
            }
            setLoading(false);
        };

        fetchProcessors();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Processors</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="bg-neutral-900">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Manufacturer</th>
                        <th className="border p-2">Socket</th>
                        <th className="border p-2">Cores</th>
                        <th className="border p-2">Threads</th>
                        <th className="border p-2">Base (GHz)</th>
                        <th className="border p-2">Boost (GHz)</th>
                        <th className="border p-2">TDP (W)</th>
                        <th className="border p-2">Price ($)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {processors.map((cpu) => (
                        <tr key={cpu.id}>
                            <td className="border p-2">{cpu.name}</td>
                            <td className="border p-2">{cpu.manufacturer}</td>
                            <td className="border p-2">{cpu.socket}</td>
                            <td className="border p-2">{cpu.cores}</td>
                            <td className="border p-2">{cpu.threads}</td>
                            <td className="border p-2">{cpu.base_clock}</td>
                            <td className="border p-2">{cpu.boost_clock}</td>
                            <td className="border p-2">{cpu.tdp}</td>
                            <td className="border p-2">${cpu.price.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}