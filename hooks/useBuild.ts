import {useState, useEffect} from 'react';
import {toast} from 'sonner';
import {addPartToBuild, getCompatibilityConflicts, resolveConflicts} from '@/utils/compatibility';

/**
 * Represents a PC build with all its components
 * @property {any} id - Unique identifier for the build
 * @property {string} [name] - User-defined name for the build
 * @property {any} [processor] - The CPU component
 * @property {any} [motherboard] - The motherboard component
 * @property {any[]} [memory] - Array of RAM modules
 * @property {any} [gpu] - The graphics card component
 * @property {any[]} [storage] - Array of storage devices
 * @property {any} [psu] - The power supply unit
 * @property {any} [case] - The PC case
 * @property {any} [cooling] - The cooling solution
 */
export type Build = {
    id: any;
    name?: string;
    processor?: any;
    motherboard?: any;
    memory?: any[];
    gpu?: any;
    storage?: any[];
    psu?: any;
    case?: any;
    cooling?: any;
};

/** Default build state with all components unset */
const defaultBuild: Build = {
    id: null,
    name: "My PC Build",
    processor: null,
    motherboard: null,
    memory: [],
    gpu: null,
    storage: [],
    psu: null,
    case: null,
    cooling: null,
};

/**
 * Toggles the shared status of a build on the server
 * @param {string} buildId - The ID of the build to update
 * @param {boolean} is_shared - Whether the build should be shared or not
 * @returns {Promise<any>} The server response
 */
const toggleShareBuild = async (buildId: string, is_shared: boolean) => {
    const res = await fetch('/api/share-build', {
        method: 'PATCH',
        body: JSON.stringify({buildId, is_shared}),
        headers: {'Content-Type': 'application/json'},
    });
    return res.json();
};

/**
 * Custom hook to manage the PC build state
 * Handles loading/saving to localStorage and provides methods to modify the build
 * @returns {Object} Build state and methods to modify it
 */
export function useBuild() {
    const [build, setBuild] = useState<Build>(defaultBuild);

    // Load saved build from localStorage on component mount
    useEffect(() => {
        const stored = localStorage.getItem('build');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const initializedBuild = {
                    ...defaultBuild,
                    ...parsed,
                    memory: Array.isArray(parsed.memory) ? parsed.memory : [],
                    storage: Array.isArray(parsed.storage) ? parsed.storage : [],
                };
                console.log('Loading build from localStorage:', initializedBuild);
                setBuild(initializedBuild);
            } catch (error) {
                console.error('Error parsing stored build:', error);
                localStorage.removeItem('build');
            }
        }
    }, []); // Empty dependency array ensures this runs only on mount

    /**
     * Saves the current build state to both React state and localStorage
     * @param {Build} updated - The updated build state to save
     */
    const saveBuild = (updated: Build) => {
        console.log('Saving build:', updated);
        setBuild(updated);
        localStorage.setItem('build', JSON.stringify(updated));
    };

    /**
     * Updates a specific part in the build with compatibility checks
     * @param {keyof Build} type - The type of part to update (e.g., 'processor', 'gpu')
     * @param {any} part - The part data to add
     * @param {boolean} [force=false] - Whether to force add the part despite compatibility issues
     */
    const updateBuild = (type: keyof Build, part: any, force = false) => {
        console.log('Attempting to add:', {type, part});
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
                        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added with conflicts resolved`);
                    },
                },
            });
            return;
        }
        saveBuild(tentativeBuild);
        console.log('Build successfully updated:', tentativeBuild);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} successfully added`);
    };

    /**
     * Updates a specific part in the build directly without compatibility checks
     * @param {keyof Build} type - The type of part to update
     * @param {any} value - The new value for the part
     */
    const updatePart = (type: keyof Build, value: any) => {
        const updated = {...build, [type]: value};
        saveBuild(updated);
    };

    /**
     * Removes a specific part from the build
     * @param {string} type - The type of part to remove
     * @param {number | string} [id] - Optional ID of the specific part to remove (for storage/memory)
     */
    const clearPart = (type: string, id?: number | string) => {
        const updated = {...build};

        if (type === 'storage') {
            if (typeof id === 'number') {
                updated.storage = (updated.storage || []).filter((_: any, i: number) => i !== id);
            } else {
                updated.storage = (updated.storage || []).filter(s => s._uid !== id);
            }
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

    /**
     * Sets a storage device as the primary (first in the array)
     * @param {string} uid - The unique identifier of the storage device to make primary
     */
    const markAsPrimaryStorage = (uid: string) => {
        const storage = [...(build.storage || [])];
        const index = storage.findIndex(s => s._uid === uid);
        if (index === -1) return;
        const [primary] = storage.splice(index, 1);
        storage.unshift(primary);
        saveBuild({...build, storage});
    };

    /**
     * Resets the build to its default state
     */
    const resetBuild = () => {
        localStorage.removeItem('build');
        console.log('Resetting build to default:', defaultBuild);
        toast.info('Resetting build to default configuration');
        setBuild({...defaultBuild});
        // hard refresh the page to ensure all components are reset
        window.location.reload();
        toast.success('Build reset successfully');
    };

    return {
        build,           // Current build state
        updateBuild,     // Update a part with compatibility checks
        clearPart,       // Remove a specific part
        resetBuild,      // Reset to default build
        updatePart,      // Directly update a part without compatibility checks
        markAsPrimaryStorage, // Set a storage device as primary
        toggleShareBuild,     // Toggle build sharing status
    };
}
