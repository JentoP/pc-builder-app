'use client';
import {useEffect, useState} from 'react';
import {createClient} from '@/utils/supabase/client';

type StorageModalProps = {
    onSelect: (storage: any) => void;
    onClose: () => void;
    motherboard?: any;
};

export default function StorageModal({onSelect, onClose, motherboard}: StorageModalProps) {
    const [storage, setStorage] = useState([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchStorage = async () => {
            let query = supabase.from('storages').select('*');
            const mobo = motherboard;
            if (mobo) {
                query = query.or(`(interface.eq.nvme,interface.eq.sata)`); // if both are accepted
            }

            const {data, error} = await supabase.from('storage').select('*');
            if (error) console.error('Error fetching storage:', error.message);
            else { // @ts-ignore
                setStorage(data || []);
            }
        };
        fetchStorage();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded max-h-[80vh] overflow-y-auto w-[90%] max-w-4xl relative">
                <h2 className="text-xl font-bold mb-4">Select storage</h2>
                <button className="absolute top-4 right-6 text-red-500" onClick={onClose}>✖</button>
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Manufacturer</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Capacity</th>
                        <th className="border p-2">Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {storage
                        .filter((s: any) => {
                            if (!motherboard) return true;
                            if (s.interface === 'nvme' && motherboard.nvme_slots < 1) return false;
                            if (s.interface === 'sata' && motherboard.sata_ports < 1) return false;
                            return true;
                        })
                        .map((storage: any) => (
                            <tr key={storage.id}>
                                <td className="border p-2">{storage.name}</td>
                                <td className="border p-2">{storage.interface}</td>
                                <td className="border p-2">{storage.capacity} GB</td>
                                <td className="border p-2">${storage.price.toFixed(2)}</td>
                                <td className="border p-2">
                                    <button className="bg-green-500 text-white px-2 py-1 rounded"
                                            onClick={() => onSelect(storage)}>Select
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
