'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Storage = {
    id: string;
    name: string;
    interface: string;
    capacity: number;
    price: number;
};

type StorageModalProps = {
    motherboard?: {
        nvme_slots: number;
        sata_ports: number;
    };
    onSelect: (storage: Storage) => void;
    onClose: () => void;
};

export default function StorageModal({ motherboard, onSelect, onClose }: StorageModalProps) {
    const supabase = createClient();
    const [storages, setStorages] = useState<Storage[]>([]);

    useEffect(() => {
        const fetchStorages = async () => {
            const { data, error } = await supabase.from('storages').select('*');
            if (error) {
                console.error('Error fetching storages:', error.message);
            } else {
                setStorages(data || []);
            }
        };

        fetchStorages();
    }, []);

    const filtered = storages.filter((s) => {
        if (!motherboard) return true;
        if (s.interface === 'nvme' && motherboard.nvme_slots < 1) return false;
        if (s.interface === 'sata' && motherboard.sata_ports < 1) return false;
        return true;
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded max-h-[80vh] overflow-y-auto w-[90%] max-w-4xl relative">
                <h2 className="text-xl font-bold mb-4">Select Storage</h2>
                <button className="absolute top-4 right-6 text-red-500" onClick={onClose}>✖</button>

                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Interface</th>
                        <th className="border p-2">Capacity (GB)</th>
                        <th className="border p-2">Price ($)</th>
                        <th className="border p-2">Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((s) => (
                        <tr key={s.id}>
                            <td className="border p-2">{s.name}</td>
                            <td className="border p-2">{s.interface}</td>
                            <td className="border p-2">{s.capacity}</td>
                            <td className="border p-2">${s.price.toFixed(2)}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => onSelect(s)}
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