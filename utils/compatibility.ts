import { Build } from '@/hooks/useBuild';

export type Conflict = {
    partType: keyof Build;
    partId?: number | string;
    reason: string;
};

export function applyConflicts(build: Build, conflicts: Conflict[], type: keyof Build, part: any): Build {
    const updatedBuild: Build = { ...build };

    conflicts.forEach(conflict => {
        if (conflict.partType === 'storage') {
            updatedBuild.storage = (updatedBuild.storage || []).filter(s => s.id !== conflict.partId);
        } else if (conflict.partType === 'memory') {
            updatedBuild.memory = [];
        } else {
            updatedBuild[conflict.partType] = null;
        }
    });

    if (type === 'storage') {
        updatedBuild.storage = [...(updatedBuild.storage || []), { ...part, _uid: crypto.randomUUID() }];
    } else if (type === 'memory') {
        updatedBuild.memory = [...(updatedBuild.memory || []), part];
    } else {
        updatedBuild[type] = part;
    }

    return updatedBuild;
}

function getSocket(part: any): string | null {
    return part?.socket || part?.cpu_socket || null;
}

export function getCompatibilityConflicts(type: keyof Build, part: any, current: Build): Conflict[] {
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
        for (const ram of current.memory || []) {
            if (ram.memory_type !== newRamType) {
                conflicts.push({
                    partType: 'memory',
                    reason: 'RAM type is incompatible with the selected motherboard.',
                });
                break;
            }
        }

        const newFormFactor = part?.form_factor?.trim().toUpperCase();
        const caseFormFactors = current.case?.supported_mb_sizes?.map((f: string) => f.trim().toUpperCase()) || [];
        if (current.case && !caseFormFactors.includes(newFormFactor)) {
            conflicts.push({
                partType: 'case',
                reason: 'Motherboard form factor is not supported by the current case.',
            });
        }

        const nvmeLimit = part?.nvme_slots || 0;
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
    }

    if (type === 'memory') {
        const mbRamType = current.motherboard?.memory_type;
        if (mbRamType && part.memory_type !== mbRamType) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Motherboard does not support this RAM type.',
            });
        }

        const totalRam = (current.memory || []).reduce((sum, m) => sum + (m.size || 0), 0) + (part.size || 0);
        const maxRam = current.motherboard?.max_memory || 0;
        if (maxRam && totalRam > maxRam) {
            conflicts.push({
                partType: 'memory',
                reason: `Total RAM exceeds motherboard's maximum capacity of ${maxRam}GB.`,
            });
        }
    }

    if (type === 'gpu') {
        const newLength = part?.length || 0;
        const caseMaxLength = current.case?.max_gpu_length || 0;
        if (caseMaxLength && newLength > caseMaxLength) {
            conflicts.push({
                partType: 'case',
                reason: 'GPU is too long for the current case.',
            });
        }

        const newPower = part?.power || 0;
        const psuPower = current.psu?.power || 0;
        if (psuPower && newPower > psuPower) {
            conflicts.push({
                partType: 'psu',
                reason: 'Power supply does not have enough power for this GPU.',
            });
        }
    }

    if (type === 'psu') {
        const newPower = part?.power || 0;
        const gpuPower = current.gpu?.power || 0;
        if (gpuPower && newPower < gpuPower) {
            conflicts.push({
                partType: 'gpu',
                reason: 'Power supply does not have enough power for the current GPU.',
            });
        }
    }

    if (type === 'case') {
        const newFormFactor = part?.supported_mb_sizes?.map((f: string) => f.trim().toUpperCase()) || [];
        const mbFormFactor = current.motherboard?.form_factor?.trim().toUpperCase();
        if (mbFormFactor && !newFormFactor.includes(mbFormFactor)) {
            conflicts.push({
                partType: 'motherboard',
                reason: 'Case does not support the motherboard form factor.',
            });
        }

        const newMaxGpuLength = part?.max_gpu_length || 0;
        const gpuLength = current.gpu?.length || 0;
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

            if (part.interface === 'NVMe' && nvmeCount + 1 > (mb.nvme_slots || 0)) {
                conflicts.push({
                    partType: 'storage',
                    reason: `Motherboard supports only ${mb.nvme_slots || 0} NVMe device(s).`,
                });
            }
            if (part.interface === 'SATA' && sataCount + 1 > (mb.sata_ports || 0)) {
                conflicts.push({
                    partType: 'storage',
                    reason: `Motherboard supports only ${mb.sata_ports || 0} SATA device(s).`,
                });
            }
        }
    }


    return conflicts;
}
