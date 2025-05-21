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
};

const defaultBuild: Build = {
    processor: null,
    motherboard: null,
    memory: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null,
};

function getSocket(part: any): string | null {
    return part?.socket || part?.cpu_socket || null;
}

function checkCompatibility(type: keyof Build, part: any, current: Build): Partial<Build> {
    const updates: Partial<Build> = {};

    if (type === 'processor') {
        const newSocket = getSocket(part);
        const mbSocket = getSocket(current.motherboard);
        if (mbSocket && newSocket !== mbSocket) {
            updates.motherboard = null;
            toast.error('Motherboard removed due to socket incompatibility.');
        }
    }

    if (type === 'motherboard') {
        const newSocket = getSocket(part);
        const cpuSocket = getSocket(current.processor);
        if (cpuSocket && newSocket !== cpuSocket) {
            updates.processor = null;
            toast.error('Processor removed due to socket incompatibility.');
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
