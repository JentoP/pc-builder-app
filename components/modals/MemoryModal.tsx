'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type MemoryModalProps = {
    type?: string;
    onSelect: (ram: any) => void;
    onClose: () => void;
};

export default function MemoryModal({ type, onSelect, onClose }: MemoryModalProps) {
    const [memory, setMemory] = useState([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchMemory = async () => {
            const supabase = createClient();
            let query = supabase.from('memory').select('*');

            if (type) {
                query = query.eq('type', type);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching memory:', error.message);
            } else {
                setMemory(data || []);
            }
        };

        fetchMemory();
    }, [type]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded max-h-[80vh] overflow-y-auto w-[90%] max-w-4xl relative">
                <h2 className="text-xl font-bold mb-4">Select Memory</h2>
                <button className="absolute top-4 right-6 text-red-500" onClick={onClose}>✖</button>

                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Type</th>
                        <th className="border p-2">Speed (MHz)</th>
                        <th className="border p-2">Size (GB)</th>
                        <th className="border p-2">Modules</th>
                        <th className="border p-2">Price ($)</th>
                        <th className="border p-2">Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {memory.map((ram: any) => (
                        <tr key={ram.id}>
                            <td className="border p-2">{ram.name}</td>
                            <td className="border p-2">{ram.type}</td>
                            <td className="border p-2">{ram.speed}</td>
                            <td className="border p-2">{ram.size}</td>
                            <td className="border p-2">{ram.modules}</td>
                            <td className="border p-2">${ram.price.toFixed(2)}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => onSelect(ram)}
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
