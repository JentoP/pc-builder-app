import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { applyConflicts } from '@/utils/compatiblity';

export type Build = {
    processor?: any;
    motherboard?: any;
    memory?: any;
    gpu?: any;
    storage?: any[]; // Updated to array
    psu?: any;
    case?: any;
    cooling?: any;
};

const defaultBuild: Build = {
    processor: null,
    motherboard: null,
    memory: null,
    gpu: null,
    storage: [], // Default to empty array
    psu: null,
    case: null,
    cooling: null,
};

function getSocket(part: any): string | null {
    return part?.socket || part?.cpu_socket || null;
}

type Conflict = {
    partType: keyof Build;
    reason: string;
};

function getCompatibilityConflicts(type: keyof Build, part: any, current: Build): Conflict[] {
    const conflicts: Conflict[] = [];

    if (type === 'processor') {
        const newSocket = getSocket(part);
        const mbSocket = getSocket(current.motherboard);
        if (mbSocket && newSocket !== mbSocket) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Motherboard socket is incompatible with the selected CPU.',
            });
        }
    }

    if (type === 'motherboard') {
        const newSocket = getSocket(part);
        const cpuSocket = getSocket(current.processor);
        if (cpuSocket && newSocket !== cpuSocket) {
            conflicts.push({
                partType: 'processor',
                reason: 'Processor socket is incompatible with the selected motherboard.',
            });
        }

        const newRamType = part?.memory_type;
        const ramType = current.memory?.memory_type;
        if (ramType && newRamType !== ramType) {
            conflicts.push({
                partType: 'memory',
                reason: 'RAM type is incompatible with the selected motherboard.',
            });
        }

        const newFormFactor = part?.form_factor;
        const caseFormFactors = current.case?.supported_mb_sizes || [];
        if (current.case && !caseFormFactors.includes(newFormFactor)) {
            conflicts.push({
                partType: 'case',
                reason: 'Motherboard form factor is not supported by the current case.',
            });
        }

        // Check NVMe/SATA slot limits
        const nvmeLimit = part?.nvme_slots || 0;
        const sataLimit = part?.sata_ports || 0;
        const nvmeCount = (current.storage || []).filter((s: any) => s.interface === 'NVMe').length;
        const sataCount = (current.storage || []).filter((s: any) => s.interface === 'SATA').length;

        if (nvmeCount > nvmeLimit) {
            conflicts.push({
                partType: 'storage',
                reason: `Motherboard supports only ${nvmeLimit} NVMe device(s).`,
            });
        }
        if (sataCount > sataLimit) {
            conflicts.push({
                partType: 'storage',
                reason: `Motherboard supports only ${sataLimit} SATA device(s).`,
            });
        }
    }

    if (type === 'memory') {
        const newRamType = part?.memory_type;
        const mbRamType = current.motherboard?.memory_type;
        if (mbRamType && newRamType !== mbRamType) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'RAM type is incompatible with the current motherboard.',
            });
        }
    }

    if (type === 'gpu') {
        const newLength = part?.length_mm;
        const caseLimit = current.case?.max_gpu_length_mm;
        if (caseLimit && newLength > caseLimit) {
            conflicts.push({
                partType: 'case',
                reason: 'GPU is too long for the current case.',
            });
        }
    }

    if (type === 'case') {
        const supportedSizes = part?.mobo_form_factor || [];
        const mbSize = current.motherboard?.form_factor;
        if (mbSize && !supportedSizes.includes(mbSize)) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Motherboard form factor is not supported by the new case.',
            });
        }

        const gpuLength = current.gpu?.length_mm;
        const maxGpuLength = part?.max_gpu_length_mm;
        if (gpuLength && maxGpuLength && gpuLength > maxGpuLength) {
            conflicts.push({
                partType: 'gpu',
                reason: 'GPU is too long for the new case.',
            });
        }
    }

    if (type === 'psu') {
        const psuWattage = part?.wattage;
        const gpuWattage = current.gpu?.recommended_wattage;
        if (gpuWattage && psuWattage < gpuWattage) {
            conflicts.push({
                partType: 'gpu',
                reason: 'PSU wattage is too low for the current GPU.',
            });
        }
    }

    return conflicts;
}

export function useBuild() {
    const [build, setBuild] = useState<Build>(defaultBuild);

    useEffect(() => {
        const stored = localStorage.getItem('build');
        if (stored) {
            setBuild(JSON.parse(stored));
        }
    }, []);

    const saveBuild = (updated: Build) => {
        setBuild(updated);
        localStorage.setItem('build', JSON.stringify(updated));
    };


    const updateBuild = (type: keyof Build, part: any, force = false) => {
        const isStorage = type === 'storage';
        const currentStorage = build.storage || [];

        const updatedBuild = isStorage
            ? { ...build, storage: [...currentStorage, part] }
            : { ...build, [type]: part };

        const conflicts = getCompatibilityConflicts(type, part, updatedBuild);

        if (conflicts.length > 0 && !force) {
            toast.error(`Incompatible ${type}`, {
                description: conflicts.map(c => `• ${c.reason}`).join('\n'),
                action: {
                    label: 'Add anyway',
                    onClick: () => {
                        const resolvedBuild = applyConflicts(build, conflicts, type, part);
                        saveBuild(resolvedBuild);
                        toast.success(`${type.toUpperCase()} added with conflicts resolved`);
                    },
                },
            });
            return;
        }

        const finalBuild = force && conflicts.length > 0
            ? applyConflicts(build, conflicts, type, part)
            : updatedBuild;

        saveBuild(finalBuild);
        toast.success(`${type.toUpperCase()} added successfully`);
    };

    const updatePart = (type: keyof Build, value: any) => {
        const updated = { ...build, [type]: value };
        saveBuild(updated);
    };

    const clearPart = (type: string, id?: number) => {
        const updated = { ...build };

        if (type === 'storage' && id) {
            const newStorage = (updated.storage || []).filter((s: any) => s.id !== id);

            // Promote the next available storage to primary if primary was removed
            if (build.storage?.[0]?.id === id && newStorage.length > 0) {
                const [newPrimary, ...rest] = newStorage;
                updated.storage = [newPrimary, ...rest];
            } else {
                updated.storage = newStorage;
            }
        } else {
            // @ts-ignore
            updated[type] = null;
        }

        saveBuild(updated);
    };


    const markAsPrimaryStorage = (id: string) => {
        const storage = [...(build.storage || [])];
        const index = storage.findIndex((s: any) => s.id === id);
        if (index === -1) return;
        const [primary] = storage.splice(index, 1);
        storage.unshift(primary);
        saveBuild({ ...build, storage });
    };

    const resetBuild = () => {
        setBuild(defaultBuild);
        localStorage.removeItem('build');
        toast.success('Build reset successfully');
    };

    return {
        build,
        updateBuild,
        clearPart,
        resetBuild,
        updatePart,
        markAsPrimaryStorage,
    };
}
