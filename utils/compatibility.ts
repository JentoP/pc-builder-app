import { Build } from '@/hooks/useBuild';
import {toast} from "sonner";

// Type definition for compatibility conflicts
export type Conflict = {
    partType: keyof Build;  // The type of PC part causing the conflict
    partId?: number | string;  // Optional ID of the specific part
    reason: string;  // Human-readable explanation of the conflict
};

/**
 * Resolves conflicts by removing incompatible parts from the build
 * @param build - Current build state
 * @param conflicts - Array of conflict objects to resolve
 * @returns Updated build with conflicts resolved
 */
export function resolveConflicts(build: Build, conflicts: Conflict[]): Build {
    const updated: Build = { ...build };

    for (const conflict of conflicts) {
        const type = conflict.partType;
        if (type === 'storage') {
            // Remove specific storage device by ID
            updated.storage = (updated.storage || []).filter(s => s.id !== conflict.partId);
        } else if (type === 'memory') {
            // Clear all memory modules
            updated.memory = [];
        } else {
            // Clear the incompatible part
            updated[type] = null;
        }
    }
    return updated;
}

/**
 * Adds a part to the build, handling special cases for storage and memory
 * @param build - Current build state
 * @param type - Type of part to add
 * @param part - Part data to add
 * @returns Updated build with the new part
 */
export function addPartToBuild(build: Build, type: keyof Build, part: any): Build {
    const updated = { ...build };

    if (type === 'storage') {
        // Add storage with unique ID
        updated.storage = [...(updated.storage || []), { ...part, _uid: crypto.randomUUID() }];
    } else if (type === 'memory') {
        const currentMemory = updated.memory || [];
        const motherboard = build.motherboard;
        const maxModules = motherboard?.memory_ports || 4;

        // Validate memory module count
        if (currentMemory.length + 1 > maxModules) {
            toast.error(`Cannot add more memory modules. Maximum ${maxModules} modules allowed.`);
        }

        updated.memory = [...currentMemory, part];
    } else {
        updated[type] = part;
    }

    return updated;
}

/**
 * Checks for compatibility issues when adding a new part to the build
 * @param type - Type of part being added
 * @param part - Part data being added
 * @param current - Current build state
 * @returns Array of conflict objects if any incompatibilities found
 */
export function getCompatibilityConflicts(type: keyof Build, part: any, current: Build): Conflict[] {
    const conflicts: Conflict[] = [];

    // Check CPU-Motherboard socket compatibility
    if (type === 'processor') {
        const newSocket = part?.socket || null;
        const mbSocket = current.motherboard?.socket || null;
        if (mbSocket && newSocket !== mbSocket) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Motherboard socket is incompatible with the selected CPU.',
            });
        }
    }

    // Check motherboard-related compatibilities
    if (type === 'motherboard') {
        // Socket compatibility with CPU
        const newSocket = part?.socket || null;
        const cpuSocket = current.processor?.socket || null;
        if (cpuSocket && newSocket !== cpuSocket) {
            conflicts.push({
                partType: 'processor',
                reason: 'Processor socket is incompatible with the selected motherboard.',
            });
        }

        // RAM type compatibility
        const motherboardRamTypes = (part?.memory_type || '').split(',').map(t => t.trim().toUpperCase());
        for (const ram of current.memory || []) {
            if (ram.type) {
                const ramType = ram.type.trim().toUpperCase();
                if (motherboardRamTypes.length > 0 && !motherboardRamTypes.includes(ramType)) {
                    conflicts.push({
                        partType: 'memory',
                        partId: ram.id,
                        reason: `RAM type (${ram.type}) is not compatible with the selected motherboard (supports ${part.memory_type}).`,
                    });
                }
            }
            
            // RAM speed compatibility
            if (ram.speed && part.memory_speed) {
                const ramSpeed = parseInt(ram.speed);
                const maxSpeed = parseInt(part.memory_speed);
                if (ramSpeed > maxSpeed) {
                    conflicts.push({
                        partType: 'memory',
                        partId: ram.id,
                        reason: `RAM speed (${ram.speed}MHz) exceeds motherboard's maximum supported speed (${part.memory_speed}MHz).`,
                    });
                }
            }
        }

        // Case form factor compatibility
        const newFormFactor = part?.form_factor?.trim().toUpperCase();
        const caseFormFactors = current.case?.mobo_form_factor?.split(',').map((f: string) => f.trim().toUpperCase()) || [];
        if (current.case && !caseFormFactors.includes(newFormFactor)) {
            conflicts.push({
                partType: 'case',
                reason: 'Motherboard form factor is not supported by the current case.',
            });
        }

        // Storage port limits
        const nvmeLimit = part?.nvme_ports || 0;
        const sataLimit = part?.sata_ports || 0;
        const testStorage = [...(current.storage || [])];
        const nvmeCount = testStorage.filter((s: any) => s.interface === 'NVMe').length;
        const sataCount = testStorage.filter((s: any) => s.interface === 'SATA').length;
        
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

        // Memory module count validation
        const maxModules = part?.memory_ports || 4;
        const currentMemory = current.memory || [];
        if (currentMemory.length > maxModules) {
            conflicts.push({
                partType: 'memory',
                reason: `Motherboard supports only ${maxModules} memory modules.`,
            });
        }
    }

    // Memory-specific compatibility checks
    if (type === 'memory') {
        const motherboard = current.motherboard;
        if (!motherboard) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Cannot add memory without a motherboard.',
            });
            return conflicts;
        }

        // RAM type compatibility
        const motherboardRamTypes = (motherboard.memory_type || '').split(',').map(t => t.trim().toUpperCase());
        const newRamType = (part.type || '').trim().toUpperCase();
        
        if (motherboardRamTypes.length > 0 && !motherboardRamTypes.includes(newRamType)) {
            conflicts.push({
                partType: 'memory',
                reason: `RAM type (${part.type}) is not compatible with the selected motherboard (supports ${motherboard.memory_type}).`,
            });
        }

        // RAM speed compatibility
        if (part.speed && motherboard.memory_speed) {
            const ramSpeed = parseInt(part.speed);
            const maxSpeed = parseInt(motherboard.memory_speed);
            if (ramSpeed > maxSpeed) {
                conflicts.push({
                    partType: 'memory',
                    reason: `RAM speed (${part.speed}MHz) exceeds motherboard's maximum supported speed (${motherboard.memory_speed}MHz).`,
                });
            }
        }

        // Check for available NVMe ports if the memory is NVMe
        if (part.interface.startsWith('NVMe') || part.interface === 'M.2') {
            const nvmeLimit = motherboard.nvme_ports || 0;
            const currentNvmeCount = (current.storage || []).filter((s: any) => s.interface === 'NVMe').length;
            
            if (currentNvmeCount >= nvmeLimit) {
                conflicts.push({
                    partType: 'storage',
                    reason: `Cannot add NVMe memory. Motherboard only has ${nvmeLimit} NVMe port(s), and all are already in use.`,
                });
            }
        }

        // Memory module count validation
        const currentMemory = current.memory || [];
        const memoryports = currentMemory.reduce((sum, m: any) => sum + (m.modules || 1), 0);
        const maxports = motherboard.memory_ports || 4;
        
        if (memoryports + (part.modules || 1) > maxports) {
            conflicts.push({
                partType: 'memory',
                reason: `Adding this RAM would exceed the motherboard's maximum of ${maxports} memory ports.`,
            });
        }

        // Check for mixed memory configurations
        if (currentMemory.length > 0) {
            const firstRam = currentMemory[0];
            if (firstRam.speed !== part.speed) {
                conflicts.push({
                    partType: 'memory',
                    reason: 'Mismatched RAM speeds. For best performance, use identical RAM modules.',
                });
            }
            
            if (firstRam.cas_latency !== part.cas_latency) {
                conflicts.push({
                    partType: 'memory',
                    reason: 'Mismatched CAS latencies. For best performance, use identical RAM modules.',
                });
            }
        }
    }

    // GPU compatibility checks
    if (type === 'gpu') {
        const newLength = part?.length_mm || 0;
        const caseMaxLength = current.case?.max_gpu_length_mm || 0;
        if (caseMaxLength && newLength > caseMaxLength) {
            conflicts.push({
                partType: 'case',
                reason: 'GPU is too long for the current case.',
            });
        }

        const newPower = part?.tdp || 0;
        const psuPower = current.psu?.wattage || 0;
        if (psuPower && newPower > psuPower) {
            conflicts.push({
                partType: 'psu',
                reason: 'Power supply does not have enough power for this GPU.',
            });
        }
    }

    // PSU compatibility checks
    if (type === 'psu') {
        const newPower = part?.wattage || 0;
        const gpuPower = current.gpu?.tdp || 0;
        if (gpuPower && newPower < gpuPower) {
            conflicts.push({
                partType: 'gpu',
                reason: 'Power supply does not have enough power for the current GPU.',
            });
        }

        const psuForm = part?.form_factor?.trim().toUpperCase();
        const casePSUForm = current.case?.psu_form_factor?.trim().toUpperCase();
        if (casePSUForm && psuForm !== casePSUForm) {
            conflicts.push({
                partType: 'case',
                reason: 'Power supply form factor is not supported by the current case.',
            });
        }
    }

    // Case compatibility checks
    if (type === 'case') {
        const supportedFF = part?.mobo_form_factor?.split(',').map((f: string) => f.trim().toUpperCase()) || [];
        const mbFormFactor = current.motherboard?.form_factor?.trim().toUpperCase();
        if (mbFormFactor && !supportedFF.includes(mbFormFactor)) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Case does not support the motherboard form factor.',
            });
        }

        const newMaxGpuLength = part?.max_gpu_length_mm || 0;
        const gpuLength = current.gpu?.length_mm || 0;
        if (gpuLength && gpuLength > newMaxGpuLength) {
            conflicts.push({
                partType: 'gpu',
                reason: 'Case does not support the GPU length.',
            });
        }
    }

    // Storage compatibility checks
    if (type === 'storage') {
        const motherboard = current.motherboard;
        if (!motherboard) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Cannot add storage without a motherboard.',
            });
            return conflicts;
        }

        const newStorageInterface = part?.interface?.toUpperCase();
        const currentStorages = current.storage || [];
        
        // Count current storage devices by interface
        const nvmeCount = currentStorages.filter(s => s.interface?.toUpperCase() === 'NVME').length;
        const sataCount = currentStorages.filter(s => s.interface?.toUpperCase() === 'SATA').length;
        
        // Get slot limits from motherboard
        const maxNvmePorts = motherboard.nvme_ports || 0;
        const maxSataPorts = motherboard.sata_ports || 0;

        // Check if adding this storage would exceed slot limits
        if (newStorageInterface === 'NVME' && nvmeCount >= maxNvmePorts) {
            conflicts.push({
                partType: 'storage',
                reason: `Motherboard only has ${maxNvmePorts} NVMe slot(s).`,
            });
        } else if (newStorageInterface === 'SATA' && sataCount >= maxSataPorts) {
            conflicts.push({
                partType: 'storage',
                reason: `Motherboard only has ${maxSataPorts} SATA port(s).`,
            });
        }
    }

    return conflicts;
}

/**
 * Determines the next recommended part type to add to the build
 * @param build - Current build state
 * @returns The type of the next recommended part, or null if build is complete
 */
export function getNextPartType(build: Build): string | null {
    const requiredParts: (keyof Build)[] = [
        'processor',
        'motherboard',
        'memory',
        'storage',
        'cooling',
        'gpu',
        'psu',
        'case'
    ];

    for (const part of requiredParts) {
        if (part === 'memory' || part === 'storage') {
            if (!build[part] || (Array.isArray(build[part]) && build[part].length === 0)) {
                return part;
            }
        } else if (!build[part]) {
            return part;
        }
    }
    return null;
}
