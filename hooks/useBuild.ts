'use client';

import { useState, useEffect } from 'react';

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

export function useBuild() {
    const [build, setBuild] = useState<Build>(defaultBuild);

    useEffect(() => {
        const stored = localStorage.getItem('build');
        if (stored) {
            setBuild(JSON.parse(stored));
        }
    }, []);

    const updateBuild = (type: keyof Build, part: any) => {
        const updated = { ...build, [type]: part };
        setBuild(updated);
        localStorage.setItem('build', JSON.stringify(updated));
    };

    const clearPart = (type: keyof Build) => {
        updateBuild(type, null);
    };

    return {
        build,
        updateBuild,
        clearPart,
    };
}
