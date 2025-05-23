"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function UserProfileCard() {
    const supabase = createClient();
    const [profile, setProfile] = useState<{
        avatarUrl?: string;
        firstName?: string;
        lastName?: string;
        bio?: string;
    } | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError || !userData.user) {
                toast.error("User not authenticated");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("first_name, last_name, bio, avatar_url")
                .eq("id", userData.user.id)
                .single();

            if (error) {
                toast.error("Failed to load user profile");
            } else {
                setProfile({
                    firstName: data.first_name,
                    lastName: data.last_name,
                    bio: data.bio,
                    avatarUrl: data.avatar_url,
                });
            }

            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-40 w-40 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="bg-sidebar rounded-lg border p-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-40 w-40">
                    <AvatarImage
                        src={profile.avatarUrl}
                        alt="User avatar"
                        onError={(e) => e.currentTarget.src = "/images/user/placeholder.jpg"}
                    />
                    <AvatarFallback>{profile.firstName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-medium text-lg">
                        {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {profile.bio || "No bio set"}
                    </p>
                </div>
            </div>
        </div>
    );
}
