'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
type ProcessorModalProps = {
    socket?: string;
    onSelect: (cpu: any) => void;
    onClose: () => void;
};

export default function ProcessorModal({ socket, onSelect, onClose }: ProcessorModalProps) {
    const [processors, setProcessors] = useState([]);
    const supabase = createClient();
    useEffect(() => {
        const fetchProcessors = async () => {
            let query = supabase.from('processors').select('*');

            if (socket) {
                query = query.eq('socket', socket);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching processors:', error.message);
            } else {
                // @ts-ignore
                setProcessors(data || []);
            }
        };

        fetchProcessors();
    }, [socket]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded max-h-[80vh] overflow-y-auto w-[90%] max-w-4xl relative">
                <h2 className="text-xl font-bold mb-4">Select a Processor</h2>
                <button className="absolute top-4 right-6 text-red-500" onClick={onClose}>✖</button>

                <table className="w-full table-auto border-collapse border ">
                    <thead className="">
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Manufacturer</th>
                        <th className="border p-2">Socket</th>
                        <th className="border p-2">Cores</th>
                        <th className="border p-2">Threads</th>
                        <th className="border p-2">Base</th>
                        <th className="border p-2">Boost</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {processors.map((cpu: any) => (
                        <tr key={cpu.id}>
                            <td className="border p-2">{cpu.name}</td>
                            <td className="border p-2">{cpu.manufacturer}</td>
                            <td className="border p-2">{cpu.socket}</td>
                            <td className="border p-2">{cpu.cores}</td>
                            <td className="border p-2">{cpu.threads}</td>
                            <td className="border p-2">{cpu.base_clock}</td>
                            <td className="border p-2">{cpu.boost_clock}</td>
                            <td className="border p-2">${cpu.price.toFixed(2)}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => onSelect(cpu)}
                                >
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
