"use client";

import { useProfile } from "@/hooks/fetchUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfileCardProps {
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
}

export function UserProfileCard({ avatarUrl, firstName, lastName, bio }: UserProfileCardProps = {}) {
    const { profile, loading } = useProfile();
    
    const displayProfile = {
        avatarUrl: avatarUrl || profile.avatarUrl,
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName,
        bio: bio || profile.bio
    };

    if (loading) {
        return (
            <div className="rounded-lg border p-4 shadow-lg">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>
        );
    }

    if (!displayProfile.avatarUrl && !displayProfile.bio) {
        return null;
    }

    const displayName = [displayProfile.firstName, displayProfile.lastName]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="bg-sidebar rounded-lg border p-4 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                {displayProfile.avatarUrl && (
                    <Avatar className="h-32 w-32">
                        <AvatarImage src={displayProfile.avatarUrl} alt={displayName} />
                        <AvatarFallback>
                            {displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold">{displayName || 'User'}</h2>
                    {displayProfile.bio && (
                        <p className="text-muted-foreground mt-2">{displayProfile.bio}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
