import { Build } from '@/hooks/useBuild';
import {toast} from "sonner";

export type Conflict = {
    partType: keyof Build;
    partId?: number | string;
    reason: string;
};

export function resolveConflicts(build: Build, conflicts: Conflict[]): Build {
    const updated: Build = { ...build };

    for (const conflict of conflicts) {
        const type = conflict.partType;
        if (type === 'storage') {
            updated.storage = (updated.storage || []).filter(s => s.id !== conflict.partId);
        } else if (type === 'memory') {
            updated.memory = [];
        } else {
            updated[type] = null;
        }
    }

    return updated;
}

export function addPartToBuild(build: Build, type: keyof Build, part: any): Build {
    const updated = { ...build };

    if (type === 'storage') {
        updated.storage = [...(updated.storage || []), { ...part, _uid: crypto.randomUUID() }];
    } else if (type === 'memory') {
        const currentMemory = updated.memory || [];
        const motherboard = build.motherboard;
        const maxModules = motherboard?.memory_slots || 4; // Default to 4 if not specified

        // Check if we would exceed max modules
        if (currentMemory.length + 1 > maxModules) {
            toast.error(`Cannot add more memory modules. Maximum ${maxModules} modules allowed.`);
        }

        // Add the new memory module
        updated.memory = [...currentMemory, part];
    } else {
        updated[type] = part;
    }

    return updated;
}

export function getCompatibilityConflicts(type: keyof Build, part: any, current: Build): Conflict[] {
    const conflicts: Conflict[] = [];

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

    if (type === 'motherboard') {
        const newSocket = part?.socket || null;
        const cpuSocket = current.processor?.socket || null;
        if (cpuSocket && newSocket !== cpuSocket) {
            conflicts.push({
                partType: 'processor',
                reason: 'Processor socket is incompatible with the selected motherboard.',
            });
        }

        const newRamType = part?.chipset || null;
        for (const ram of current.memory || []) {
            if (ram.type !== newRamType) {
                conflicts.push({
                    partType: 'memory',
                    reason: 'RAM type is incompatible with the selected motherboard.',
                });
                break;
            }
        }

        const newFormFactor = part?.form_factor?.trim().toUpperCase();
        const caseFormFactors = current.case?.mobo_form_factor?.split(',').map((f: string) => f.trim().toUpperCase()) || [];
        if (current.case && !caseFormFactors.includes(newFormFactor)) {
            conflicts.push({
                partType: 'case',
                reason: 'Motherboard form factor is not supported by the current case.',
            });
        }

        const nvmeLimit = part?.m2_slots || 0;
        const sataLimit = part?.sata_slots || 0;
        const testStorage = [...(current.storage || [])];
        const nvmeCount = testStorage.filter((s: any) => s.interface === 'NVMe').length;
        const sataCount = testStorage.filter((s: any) => s.interface === 'SATA').length;
console.log( nvmeCount, nvmeLimit, sataCount, sataLimit);
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

        // Add memory module count validation
        const maxModules = part?.memory_slots || 4; // Default to 4 if not specified
        const currentMemory = current.memory || [];
        if (currentMemory.length > maxModules) {
            conflicts.push({
                partType: 'memory',
                reason: `Motherboard supports only ${maxModules} memory modules.`,
            });
        }
    }

    if (type === 'memory') {
        const motherboard = current.motherboard;
        if (!motherboard) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Cannot add memory without a motherboard.',
            });
            return conflicts;
        }

        const maxModules = motherboard.memory_slots || 4;
        const currentMemory = current.memory || [];
        if (currentMemory.length + 1 > maxModules) {
            conflicts.push({
                partType: 'memory',
                reason: `Cannot add more memory modules. Maximum ${maxModules} modules allowed.`,
            });
        }

        const newRamType = part?.type || 'DDR4'; // Use type directly from memory part
        for (const ram of currentMemory) {
            if (ram.type !== newRamType) {
                conflicts.push({
                    partType: 'memory',
                    reason: 'RAM type is incompatible with the selected motherboard.',
                });
                break;
            }
        }

        // Combine current memory
        const memory = [...(current.memory || []), part];

        // Ensures all kits are identical
        const uniqueIds = new Set(memory.map((m: any) => m.id));
        if (uniqueIds.size > 1) {
            conflicts.push({
                partType: 'memory',
                reason: 'All RAM kits must be of the same model (matched memory).',
            });
        }

        // Total capacity
        const totalRam = memory.reduce((sum, m: any) => sum + (m.size || 0), 0);
        const maxRam = motherboard?.max_memory || 0;
        if (maxRam && totalRam > maxRam) {
            conflicts.push({
                partType: 'memory',
                reason: `Total RAM (${totalRam}GB) exceeds motherboard's maximum of ${maxRam}GB.`,
            });
        }

        // Slot usage
        const totalModulesUsed = memory.reduce((sum, m: any) => sum + (m.modules || 1), 0);
        const maxSlots = motherboard?.memory_slots || 4;
        if (totalModulesUsed > maxSlots) {
            conflicts.push({
                partType: 'memory',
                reason: `Total memory modules (${totalModulesUsed}) exceed motherboard's ${maxSlots} slots.`,
            });
        }
    }

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

    if (type === 'storage') {
        const mb = current.motherboard;
        if (mb) {
            const nvmeCount = (current.storage || []).filter((s: any) => s.interface === 'NVMe').length;
            const sataCount = (current.storage || []).filter((s: any) => s.interface === 'SATA').length;

            if (part.interface === 'NVMe' && nvmeCount + 1 > (mb.m2_slots || 0)) {
                conflicts.push({
                    partType: 'storage',
                    reason: `Motherboard supports only ${mb.m2_slots || 0} NVMe device(s).`,
                });
            }
            if (part.interface === 'SATA' && sataCount + 1 > (mb.sata_slots || 0)) {
                conflicts.push({
                    partType: 'storage',
                    reason: `Motherboard supports only ${mb.sata_slots || 0} SATA device(s).`,
                });
            }
        }
    }

    return conflicts;
}
