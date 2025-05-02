"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/api/supabase/client";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/app/api/hooks/fetch-user";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function UpdateUserProfile() {
    const supabase = createClient();
    const { profile, loading: loadingProfile, error: fetchError } = useProfile();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setBio(profile.bio);
        setAvatarUrl(profile.avatarUrl);
    }, [profile]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const { data, error: userError } = await supabase.auth.getUser();
        const user = data?.user;

        if (!user || !user.id) {
            setError("User not found");
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
            setError(updateError.message);
        } else {
            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md p-4">
            {loadingProfile && <p>Loading profile...</p>}
            {fetchError && <p className="text-red-500">{fetchError}</p>}
            {!loadingProfile && (
                <form onSubmit={handleUpdate} className="space-y-4">
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

                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-600 mt-4">Profile updated successfully!</p>}
        </div>
    );
}
