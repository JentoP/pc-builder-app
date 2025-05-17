'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
type MotherboardModalProps = {
    socket?: string;
    onSelect: (mobo: any) => void;
    onClose: () => void;
};

export default function MotherboardModal({ socket, onSelect, onClose }: MotherboardModalProps) {
    const supabase = createClient();
    const [motherboards, setMotherboards] = useState([]);
    useEffect(() => {
        const fetchMotherboards = async () => {
            let query = supabase.from('motherboards').select('*');
            if (socket) {
                query = query.eq('socket', socket);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching motherboards:', error.message);
            } else {
                // @ts-ignore
                setMotherboards(data || []);
            }
        };
        fetchMotherboards();
    }, [socket]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded max-h-[80vh] overflow-y-auto w-[90%] max-w-4xl relative">
                <h2 className="text-xl font-bold mb-4">Select Motherboard</h2>
                <button className="absolute top-4 right-6 text-red-500" onClick={onClose}>✖</button>

                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Socket</th>
                        <th className="border p-2">Chipset</th>
                        <th className="border p-2">Form Factor</th>
                        <th className="border p-2">Slots</th>
                        <th className="border p-2">Max Memory</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {motherboards.map((mobo: any) => (
                        <tr key={mobo.id}>
                            <td className="border p-2">{mobo.name}</td>
                            <td className="border p-2">{mobo.socket}</td>
                            <td className="border p-2">{mobo.chipset}</td>
                            <td className="border p-2">{mobo.form_factor}</td>
                            <td className="border p-2">{mobo.memory_slots}</td>
                            <td className="border p-2">{mobo.max_memory} GB</td>
                            <td className="border p-2">${mobo.price.toFixed(2)}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => onSelect(mobo)}
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
