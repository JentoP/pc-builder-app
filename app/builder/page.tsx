'use client';
import {useState} from 'react';
import ProcessorModal from '@/components/modals/ProcessorModal';
import MemoryModal from '@/components/modals/MemoryModal';
import MotherboardModal from '@/components/modals/MotherboardModal';
import GpuModal from '@/components/modals/GpuModal';
import StorageModal from '@/components/modals/StorageModal';
import PsuModal from '@/components/modals/PsuModal';
import CaseModal from '@/components/modals/CaseModal';
import {useBuild} from '@/hooks/useBuild'

type Build = {
    processor: any;
    motherboard: any;
    memory: any;
    gpu: any;
    storage: any;
    psu: any;
    case: any;
};

export default function BuilderPage() {
    const {build, updateBuild, clearPart} = useBuild();
    const [modalOpen, setModalOpen] = useState<keyof Build | null>(null);

    const handleSelect = (type: keyof Build, part: any) => {
        updateBuild(type, part);
        setModalOpen(null);
    };
    const builderRow = (label: string, partKey: keyof Build, showValue: (part: any) => string) => (
        <div className="mb-4">
            <p className="font-semibold">{label}:</p>
            {build[partKey] ? (
                <div className="border p-2 rounded bg-gray-100">{showValue(build[partKey])}</div>
            ) : <p className="text-gray-500">No {label.toLowerCase()} selected</p>}
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setModalOpen(partKey)}>
                Choose {label}
            </button>
            {build[partKey] && (
                <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded" onClick={() => clearPart(partKey)}>
                    Remove {label}
                </button>
            )}
        </div>
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Build Your PC</h1>

            {builderRow('Processor', 'processor', (p) => `${p.name} - $${p.price.toFixed(2)}`)}
            {builderRow('Motherboard', 'motherboard', (p) => `${p.name} - $${p.price.toFixed(2)}`)}
            {builderRow('Memory (RAM)', 'memory', (p) => `${p.name} - ${p.size * p.modules}GB - $${p.price.toFixed(2)}`)}
            {builderRow('GPU', 'gpu', (p) => `${p.name} - $${p.price.toFixed(2)}`)}
            {builderRow('Storage', 'storage', (p) => `${p.name} - ${p.capacity}GB - $${p.price.toFixed(2)}`)}
            {builderRow('Power Supply (PSU)', 'psu', (p) => `${p.name} - ${p.wattage}W - $${p.price.toFixed(2)}`)}
            {builderRow('Case', 'case', (p) => `${p.name} - ${p.form_factor} - $${p.price.toFixed(2)}`)}

            {modalOpen === 'processor' && (
                <ProcessorModal
                    socket={build.motherboard?.socket}
                    onSelect={(cpu) => handleSelect('processor', cpu)}
                    onClose={() => setModalOpen(null)}/>
            )}
            {modalOpen === 'motherboard' && (
                <MotherboardModal
                    build={build}
                    onSelect={(mobo) => handleSelect('motherboard', mobo)}
                    onClose={() => setModalOpen(null)}
                />
            )}
            {modalOpen === 'memory' && (
                <MemoryModal
                    type={build.motherboard?.memory_type}
                    onSelect={(ram) => handleSelect('memory', ram)}
                    onClose={() => setModalOpen(null)}
                />
            )}
            {modalOpen === 'gpu' && (
                <GpuModal onSelect={(gpu) => handleSelect('gpu', gpu)} onClose={() => setModalOpen(null)}/>
            )}
            {modalOpen === 'storage' && (
                <StorageModal
                    motherboard={build.motherboard}
                    onSelect={(storage) => handleSelect('storage', storage)}
                    onClose={() => setModalOpen(null)}
                />
            )}
            {modalOpen === 'psu' && (
                <PsuModal onSelect={(psu) => handleSelect('psu', psu)} onClose={() => setModalOpen(null)}/>
            )}
            {modalOpen === 'case' && (
                <CaseModal onSelect={(pcCase) => handleSelect('case', pcCase)} onClose={() => setModalOpen(null)}/>
            )}
        </div>
    );
}
