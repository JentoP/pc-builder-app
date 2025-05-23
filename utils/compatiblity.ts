import { Build } from '@/hooks/useBuild';

export type Conflict = {
    partType: keyof Build;
    partId?: number | string;
    reason: string;
};

/**
 * Resolves conflicts by removing conflicting parts from the build.
 * Can handle both single and multiple part types.
 */
export function applyConflicts(build: Build, conflicts: Conflict[], type: keyof Build, part: any): Build {
    const updatedBuild: Build = { ...build };

    conflicts.forEach(conflict => {
        if (conflict.partType === 'storage') {
            updatedBuild.storage = (updatedBuild.storage || []).filter(s => s.id !== conflict.partId);
        } else {
            updatedBuild[conflict.partType] = null;
        }
    });

    if (type === 'storage') {
        updatedBuild.storage = [...(updatedBuild.storage || []), part];
    } else {
        updatedBuild[type] = part;
    }

    return updatedBuild;
}
