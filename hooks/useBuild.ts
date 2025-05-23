import {useState, useEffect} from 'react';
import {toast} from 'sonner';
import {applyConflicts, getCompatibilityConflicts} from '@/utils/compatibility';

export type Build = {
    processor?: any;
    motherboard?: any;
    memory?: any[];
    gpu?: any;
    storage?: any[];
    psu?: any;
    case?: any;
    cooling?: any;
};

const defaultBuild: Build = {
    processor: null,
    motherboard: null,
    memory: [],
    gpu: null,
    storage: [],
    psu: null,
    case: null,
    cooling: null,
};

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
        const isMemory = type === 'memory';

        const updatedStorage = isStorage
            ? [...(build.storage || []), {...part, _uid: crypto.randomUUID()}]
            : build.storage;

        const updatedMemory = isMemory
            ? [...(build.memory || []), part]
            : build.memory;

        const updatedBuild: Build = {
            ...build,
            ...(isStorage && {storage: updatedStorage}),
            ...(isMemory && {memory: updatedMemory}),
            ...(!isStorage && !isMemory && {[type]: part}),
        };

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
        const updated = {...build, [type]: value};
        saveBuild(updated);
    };

    const clearPart = (type: string, id?: number) => {
        const updated = {...build};

        if (type === 'storage' && id) {
            updated.storage = (updated.storage || []).filter((s: any) => s._uid !== id);
        } else if (type === 'memory' && id) {
            // @ts-ignore
            updated.memory = (updated.memory || []).filter((m: any, idx) => idx.toString() !== id);
        } else {
            // @ts-ignore
            updated[type] = null;
        }

        saveBuild(updated);
    };

    const markAsPrimaryStorage = (uid: string) => {
        const storage = [...(build.storage || [])];
        const index = storage.findIndex((s: any) => s._uid === uid);
        if (index === -1) return;
        const [primary] = storage.splice(index, 1);
        storage.unshift(primary);
        saveBuild({...build, storage});
    };

    const resetBuild = () => {
        localStorage.removeItem('build');
        setBuild({...defaultBuild});
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
