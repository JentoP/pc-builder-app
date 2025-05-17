'use client';
import { useState } from 'react';
import ProcessorModal from '@/components/modals/ProcessorModal';
import MemoryModal from '@/components/modals/MemoryModal';
import MotherboardModal from '@/components/modals/MotherboardModal';

type Build = {
    processor: any;
    memory: any;
    motherboard: any;
};

export default function BuilderPage() {
    const [build, setBuild] = useState<Build>({
        processor: null,
        memory: null,
        motherboard: null,
    });

    const [modalOpen, setModalOpen] = useState<'processor' | 'memory' | 'motherboard' | null>(null);

    const handleSelect = (type: keyof Build, part: any) => {
        setBuild((prev) => ({ ...prev, [type]: part }));
        setModalOpen(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Build Your PC</h1>

            {/* Processor */}
            <div className="mb-4">
                <p className="font-semibold">Processor:</p>
                {build.processor ? (
                    <div className="border p-2 rounded bg-gray-100">
                        {build.processor.name} - ${build.processor.price.toFixed(2)}
                    </div>
                ) : <p className="text-gray-500">No processor selected</p>}
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setModalOpen('processor')}>
                    Choose Processor
                </button>
            {/*    remove selection*/}
                {build.processor && (
                    <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleSelect('processor', null)}>
                        Remove Processor
                    </button>
                )}
            </div>

            {/* Motherboard */}
            <div className="mb-4">
                <p className="font-semibold">Motherboard:</p>
                {build.motherboard ? (
                    <div className="border p-2 rounded bg-gray-100">
                        {build.motherboard.name} - ${build.motherboard.price.toFixed(2)}
                    </div>
                ) : <p className="text-gray-500">No motherboard selected</p>}
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setModalOpen('motherboard')}>
                    Choose Motherboard
                </button>
                {build.motherboard && (

                    <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleSelect('motherboard', null)}>
                    Remove Motherboard
                </button>
                )}
            </div>

            {/* Memory */}
            <div className="mb-4">
                <p className="font-semibold">Memory (RAM):</p>
                {build.memory ? (
                    <div className="border p-2 rounded bg-gray-100">
                        {build.memory.name} ({build.memory.size * build.memory.modules}GB total) - ${build.memory.price.toFixed(2)}
                    </div>
                ) : <p className="text-gray-500">No memory selected</p>}
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setModalOpen('memory')}>
                    Choose Memory
                </button>
                {build.memory && (
                    <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleSelect('memory', null)}>
                    Remove Memory
                </button>
                )}
            </div>

            {/* Modals */}
            {modalOpen === 'processor' && (
                <ProcessorModal
                    socket={build.motherboard?.socket}
                    onSelect={(cpu) => handleSelect('processor', cpu)}
                    onClose={() => setModalOpen(null)}
                />
            )}

            {modalOpen === 'motherboard' && (
                <MotherboardModal
                    socket={build.processor?.socket}
                    onSelect={(mobo) => handleSelect('motherboard', mobo)}
                    onClose={() => setModalOpen(null)}
                />
            )}
            {modalOpen === 'memory' && (
                <MemoryModal
                    type={
                        build.motherboard?.chipset.startsWith('Z690') || build.motherboard?.chipset.startsWith('Z790')
                            ? 'DDR5'
                            : 'DDR4'
                    }
                    onSelect={(ram) => handleSelect('memory', ram)}
                    onClose={() => setModalOpen(null)}
                />
            )}
        </div>
    );
}
