import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export type Build = {
    processor?: any;
    motherboard?: any;
    memory?: any;
    gpu?: any;
    storage?: any;
    psu?: any;
    case?: any;
    cooling?: any;
};

const defaultBuild: Build = {
    processor: null,
    motherboard: null,
    memory: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null,
};

function getSocket(part: any): string | null {
    return part?.socket || part?.cpu_socket || null;
}

function checkCompatibility(type: keyof Build, part: any, current: Build): Partial<Build> {
    const updates: Partial<Build> = {};

    // CPU & Motherboard socket
    if (type === 'processor') {
        const newSocket = getSocket(part);
        const mbSocket = getSocket(current.motherboard);
        if (mbSocket && newSocket !== mbSocket) {
            updates.motherboard = null;
            toast.warning('Motherboard removed due to CPU socket incompatibility.');
        }
    }

    if (type === 'motherboard') {
        const newSocket = getSocket(part);
        const cpuSocket = getSocket(current.processor);
        if (cpuSocket && newSocket !== cpuSocket) {
            updates.processor = null;
            toast.warning('Processor removed due to motherboard socket incompatibility.');
        }

        const newRamType = part?.memory_type;
        const ramType = current.memory?.memory_type;
        if (ramType && newRamType !== ramType) {
            updates.memory = null;
            toast.warning('Memory removed due to motherboard RAM type incompatibility.');
        }

        const newFormFactor = part?.form_factor;
        const caseFormFactors = current.case?.supported_mb_sizes || [];
        if (current.case && !caseFormFactors.includes(newFormFactor)) {
            updates.case = null;
            toast.warning('Case removed due to incompatible motherboard size.');
        }
    }

    // RAM & Motherboard
    if (type === 'memory') {
        const newRamType = part?.memory_type;
        const mbRamType = current.motherboard?.memory_type;
        if (mbRamType && newRamType !== mbRamType) {
            updates.motherboard = null;
            toast.warning('Motherboard removed due to RAM type incompatibility.');
        }
    }

    // GPU & Case
    if (type === 'gpu') {
        const newLength = part?.length_mm;
        const caseLimit = current.case?.max_gpu_length_mm;
        if (caseLimit && newLength > caseLimit) {
            updates.case = null;
            toast.warning('Case removed due to GPU being too long.');
        }
    }

    // Case & Motherboard
    if (type === 'case') {
        const supportedSizes = part?.supported_mb_sizes || [];
        const mbSize = current.motherboard?.form_factor;
        if (mbSize && !supportedSizes.includes(mbSize)) {
            updates.motherboard = null;
            toast.warning('Motherboard removed due to case incompatibility.');
        }

        const gpuLength = current.gpu?.length_mm;
        const maxGpuLength = part?.max_gpu_length_mm;
        if (gpuLength && maxGpuLength && gpuLength > maxGpuLength) {
            updates.gpu = null;
            toast.warning('GPU removed due to case incompatibility.');
        }
    }

    // PSU & GPU
    if (type === 'psu') {
        const psuWattage = part?.wattage;
        const gpuWattage = current.gpu?.recommended_wattage;
        if (gpuWattage && psuWattage < gpuWattage) {
            updates.gpu = null;
            toast.warning('GPU removed due to PSU wattage too low.');
        }
    }

    return updates;
}

export function useBuild() {
    const [build, setBuild] = useState<Build>(defaultBuild);

    useEffect(() => {
        const stored = localStorage.getItem('build');
        if (stored) {
            setBuild(JSON.parse(stored));
        }
    }, []);

    const updateBuild = (type: keyof Build, part: any) => {
        const incompatibleParts = checkCompatibility(type, part, build);
        const updated = { ...build, ...incompatibleParts, [type]: part };
        setBuild(updated);
        localStorage.setItem('build', JSON.stringify(updated));
    };

    const clearPart = (type: keyof Build) => {
        const updated = { ...build, [type]: null };
        setBuild(updated);
        localStorage.setItem('build', JSON.stringify(updated));
    };

    return {
        build,
        updateBuild,
        clearPart,
    };
}
