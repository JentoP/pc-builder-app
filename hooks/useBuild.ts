import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { addPartToBuild, getCompatibilityConflicts, resolveConflicts } from '@/utils/compatibility';

// Type definition for a PC build
export type Build = {
    id: any;  // Unique identifier for the build
    name?: string;  // Optional build name
    processor?: any;  // CPU details
    motherboard?: any;  // Motherboard details
    memory?: any[];  // Array of RAM modules
    gpu?: any;  // Graphics card details
    storage?: any[];  // Array of storage devices
    psu?: any;  // Power supply details
    case?: any;  // PC case details
    cooling?: any;  // Cooling solution details
};

// Default empty build template
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
 * Toggles sharing status of a build
 * @param buildId - ID of the build to update
 * @param is_shared - New sharing status
 * @returns Promise with the API response
 */
const toggleShareBuild = async (buildId: string, is_shared: boolean) => {
    const res = await fetch('/api/share-build', {
        method: 'PATCH',
        body: JSON.stringify({ buildId, is_shared }),
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
};

/**
 * Custom hook for managing PC build state
 * Handles loading, updating, and persisting build data
 */
export function useBuild() {
    // State for the current build
    const [build, setBuild] = useState<Build>(defaultBuild);

    // Load build from localStorage on component mount
    useEffect(() => {
        const loadBuild = () => {
            try {
                const stored = localStorage.getItem('build');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Ensure arrays are properly initialized
                    const initializedBuild = {
                        ...defaultBuild,
                        ...parsed,
                        memory: Array.isArray(parsed.memory) ? parsed.memory : [],
                        storage: Array.isArray(parsed.storage) ? parsed.storage : [],
                    };
                    setBuild(initializedBuild);
                }
            } catch (error) {
                console.error("Error loading build from localStorage:", error);
                localStorage.removeItem('build');
            }
        };

        loadBuild();

        // Handle storage events to sync across tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'build') {
                loadBuild();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    /**
     * Saves the build to state and localStorage
     * @param updated - The updated build object
     */
    const saveBuild = (updated: Build) => {
        console.log('Saving build:', updated);
        setBuild(updated);
        localStorage.setItem('build', JSON.stringify(updated));
    };

    /**
     * Updates the build with a new part, handling compatibility checks
     * @param type - Type of part to update
     * @param part - Part data to add
     * @param force - Whether to force add despite compatibility issues
     */
    const updateBuild = (type: keyof Build, part: any, force = false) => {
        console.log('Attempting to add:', { type, part });
        console.log('Current build state:', build);

        // Create a tentative build with the new part
        const tentativeBuild = addPartToBuild(build, type, part);
        console.log('Tentative build state:', tentativeBuild);

        // Check for compatibility issues
        const conflicts = getCompatibilityConflicts(type, part, build);
        console.log('Compatibility conflicts:', conflicts);

        // Handle conflicts if any exist and not forcing
        if (conflicts.length > 0 && !force) {
            toast.error(`Incompatible ${type}`, {
                description: conflicts.map(c => `• ${c.reason}`).join('\n'),
                action: {
                    label: 'Add anyway',
                    onClick: () => {
                        // Resolve conflicts and add the part
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
        
        // Save the updated build
        saveBuild(tentativeBuild);
        console.log('Build successfully updated:', tentativeBuild);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} successfully added`);
    };

    /**
     * Updates a specific part in the build directly
     * @param type - Type of part to update
     * @param value - New value for the part
     */
    const updatePart = (type: keyof Build, value: any) => {
        setBuild(prevBuild => {
            const updated = { 
                ...prevBuild, 
                [type]: value,
                // Ensure memory and storage are always arrays
                memory: Array.isArray(prevBuild.memory) ? prevBuild.memory : [],
                storage: Array.isArray(prevBuild.storage) ? prevBuild.storage : []
            };
            localStorage.setItem('build', JSON.stringify(updated));
            return updated;
        });
    };

    /**
     * Removes a part from the build
     * @param type - Type of part to remove
     * @param id - Optional ID of the part (for storage and memory)
     */
    const clearPart = (type: string, id?: number | string) => {
        const updated = { ...build };

        if (type === 'storage') {
            // Remove storage by ID or UID
            if (typeof id === 'number') {
                updated.storage = (updated.storage || []).filter((_: any, i: number) => i !== id);
            } else {
                updated.storage = (updated.storage || []).filter(s => s._uid !== id);
            }
            // Reorganize storage if needed
            if (updated.storage?.length > 0) {
                const [primary, ...additional] = updated.storage;
                updated.storage = [primary, ...additional];
            }
        } else if (type === 'memory' && typeof id === 'number') {
            // Remove memory by index
            const index = Number(id);
            if (!isNaN(index)) {
                updated.memory = (updated.memory || []).filter((_: any, i: number) => i !== index);
            }
        } else {
            // Clear the part
            // @ts-ignore
            updated[type] = null;
        }

        saveBuild(updated);
    };

    /**
     * Marks a storage device as primary
     * @param uid - Unique ID of the storage device
     */
    const markAsPrimaryStorage = (uid: string) => {
        const storage = [...(build.storage || [])];
        const index = storage.findIndex(s => s._uid === uid);
        if (index === -1) return;
        
        // Move the selected storage to the beginning of the array
        const [primary] = storage.splice(index, 1);
        storage.unshift(primary);
        
        saveBuild({ ...build, storage });
    };

    /**
     * Resets the build to default state
     */
    const resetBuild = () => {
        localStorage.removeItem('build');
        setBuild({ ...defaultBuild });
        toast.success('Build reset successfully');
    };

    // Expose build state and methods
    return {
        build,            // Current build state
        updateBuild,      // Update build with new part (with compatibility checks)
        clearPart,        // Remove a part from the build
        resetBuild,       // Reset build to default
        updatePart,       // Directly update a part
        markAsPrimaryStorage, // Mark storage as primary
        toggleShareBuild, // Toggle build sharing status
    };
}
