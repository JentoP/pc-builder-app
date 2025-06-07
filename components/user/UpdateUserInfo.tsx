"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/fetchUser";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { UserProfileCard } from "@/components/user/UserProfileCard";
import { toast } from "sonner";

export default function UpdateUserProfile() {
    const supabase = createClient();
    const { profile, loading: loadingProfile, error: fetchError, refresh } = useProfile();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setBio(profile.bio);
        setAvatarUrl(profile.avatarUrl);
    }, [profile]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (!user || !user.id) {
            toast.error("User not found");
            setLoading(false);
            return;
        }

        const { error: updateError } = await supabase.from("profiles").upsert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            bio,
            avatar_url: avatarUrl
        }, { onConflict: "id" });

        if (updateError) {
            toast.error(updateError.message);
        } else {
            refresh();
            toast.success("Profile updated successfully!");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-4xl p-4">
            {loadingProfile && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-40 w-40" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                </div>
            )}
            {fetchError && <p className="text-red-500">{fetchError}</p>}
            {!loadingProfile && (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Info Card */}

                    <div className="flex-1">
                        <UserProfileCard
                            avatarUrl={profile.avatarUrl}
                            firstName={profile.firstName}
                            lastName={profile.lastName}
                            bio={profile.bio}
                        />
                    </div>


                    {/* Update Form */}
                    <div className="flex-1">
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium">First Name</label>
                                <Input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Last Name</label>
                                <Input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Bio</label>
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Avatar URL</label>
                                <Input
                                    type="text"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto"
                                >
                                    {loading ? "Updating..." : "Update Profile"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
