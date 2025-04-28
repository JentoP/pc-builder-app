"use client";

import {useEffect, useState} from "react";
import {createClient} from "@/app/api/supabase/client";
import {Button} from "@/components/ui/button";

export default function UpdateUserProfile() {
    const supabase = createClient();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            console.log("[loadProfile] Fetch profile");
            const {data: {session}} = await supabase.auth.getSession();
            console.log("User:", session);
            if (session) {
                const {data, error} = await supabase
                    .from('profiles')
                    .select('first_name, last_name, bio, avatar_url')
                    .eq('id', session.user.id)
                    .maybeSingle();
                console.log("Profile:", data);
                if (error) {
                    console.error("Error loading profile");
                } else if (data) {
                    setFirstName(data.first_name || "");
                    setLastName(data.last_name || "");
                    setBio(data.bio || "");
                    setAvatarUrl(data.avatar_url || "");
                }
            }
            setLoading(false);
        };

        loadProfile().then(r => {
        });
    }, [supabase]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const {data, error: userError} = await supabase.auth.getUser();
        const user = data?.user;

        if (!user || !user.id) {
            setError("User not found");
            setLoading(false);
            return;
        }

        const {error: updateError} = await supabase
            .from('profiles')
            .upsert({
                id: user.id, // MUST match auth.uid()
                first_name: firstName,
                last_name: lastName,
                bio,
                avatar_url: avatarUrl,
            }, {onConflict: 'id'}); // tells supabase to update instead of inserting duplicate

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Avatar URL</label>
                    <input
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

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-600 mt-4">Profile updated successfully!</p>}
        </div>
    );
}
