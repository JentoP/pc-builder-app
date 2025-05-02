"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useProfile() {
    const supabase = createClient();

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        avatarUrl: "",
        email: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData?.session) {
                setError("No session found");
                setLoading(false);
                return;
            }

            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                setError("User not found");
                setLoading(false);
                return;
            }

            const { data, error: profileError } = await supabase
                .from("profiles")
                .select("first_name, last_name, bio, avatar_url")
                .eq("id", userData.user.id)
                .maybeSingle();

            if (profileError) {
                setError(profileError.message);
            } else if (data) {
                setProfile({
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    bio: data.bio || "",
                    avatarUrl: data.avatar_url || "",
                    email: userData.user.email || ""
                });
            }

            setLoading(false);

            setLoading(false);
        };

        loadProfile();
    }, [supabase]);

    return { profile, loading, error };
}