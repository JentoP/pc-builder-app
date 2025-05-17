'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type GpuModalProps = {
    onSelect: (gpu: any) => void;
    onClose: () => void;
};

export default function GpuModal({ onSelect, onClose }: GpuModalProps) {
    const [gpus, setGpus] = useState([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchGpus = async () => {
            const { data, error } = await supabase.from('gpus').select('*');
            if (error) console.error('Error fetching GPUs:', error.message);
            else setGpus(data || []);
        };
        fetchGpus();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded max-h-[80vh] overflow-y-auto w-[90%] max-w-4xl relative">
                <h2 className="text-xl font-bold mb-4">Select GPU</h2>
                <button className="absolute top-4 right-6 text-red-500" onClick={onClose}>✖</button>
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Manufacturer</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {gpus.map((gpu: any) => (
                        <tr key={gpu.id}>
                            <td className="border p-2">{gpu.name}</td>
                            <td className="border p-2">{gpu.manufacturer}</td>
                            <td className="border p-2">${gpu.price.toFixed(2)}</td>
                            <td className="border p-2">
                                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => onSelect(gpu)}>Select</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
