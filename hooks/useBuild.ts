import {useState, useEffect} from 'react';
import {toast} from 'sonner';
import {addPartToBuild, getCompatibilityConflicts, resolveConflicts} from '@/utils/compatibility';

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
            console.log('Loading build from localStorage:', JSON.parse(stored));
            setBuild(JSON.parse(stored));
        }
    }, []);

    const saveBuild = (updated: Build) => {
        console.log('Saving build:', updated);
        setBuild(updated);
        localStorage.setItem('build', JSON.stringify(updated));
    };

    const updateBuild = (type: keyof Build, part: any, force = false) => {
        console.log('Attempting to add:', { type, part });
        console.log('Current build state:', build);
        
        const tentativeBuild = addPartToBuild(build, type, part);
        console.log('Tentative build state:', tentativeBuild);

        const conflicts = getCompatibilityConflicts(type, part, build);
        console.log('Compatibility conflicts:', conflicts);

        if (conflicts.length > 0 && !force) {
            toast.error(`Incompatible ${type}`, {
                description: conflicts.map(c => `• ${c.reason}`).join('\n'),
                action: {
                    label: 'Add anyway',
                    onClick: () => {
                        const buildWithoutConflicts = resolveConflicts(build, conflicts);
                        const finalBuild = type === 'memory' 
                            ? buildWithoutConflicts 
                            : addPartToBuild(buildWithoutConflicts, type, part);
                        console.log('Final build after force add:', finalBuild);
                        saveBuild(finalBuild);
                        toast.success(`${type.toUpperCase()} added with conflicts resolved`);
                    },
                },
            });
            return;
        }
        saveBuild(tentativeBuild);
        console.log('Build successfully updated:', tentativeBuild);
        toast.success(`${type.toUpperCase()} added successfully`);
    };

    const updatePart = (type: keyof Build, value: any) => {
        const updated = { ...build, [type]: value };
        saveBuild(updated);
    };

    const clearPart = (type: string, id?: number | string) => {
        const updated = { ...build };

        if (type === 'storage') {
            if (typeof id === 'number') {
                // Handle array index removal
                updated.storage = (updated.storage || []).filter((_: any, i: number) => i !== id);
            } else {
                // Handle _uid removal
                updated.storage = (updated.storage || []).filter(s => s._uid !== id);
            }
            // If removing primary storage, update the array structure
            if (updated.storage?.length > 0) {
                const [primary, ...additional] = updated.storage;
                updated.storage = [primary, ...additional];
            }
        } else if (type === 'memory' && typeof id === 'number') {
            const index = Number(id);
            if (!isNaN(index)) {
                updated.memory = (updated.memory || []).filter((_: any, i: number) => i !== index);
            }
        } else {
            // @ts-ignore
            updated[type] = null;
        }

        saveBuild(updated);
    };

    const markAsPrimaryStorage = (uid: string) => {
        const storage = [...(build.storage || [])];
        const index = storage.findIndex(s => s._uid === uid);
        if (index === -1) return;
        const [primary] = storage.splice(index, 1);
        storage.unshift(primary);
        saveBuild({ ...build, storage });
    };

    const resetBuild = () => {
        localStorage.removeItem('build');
        setBuild({ ...defaultBuild });
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