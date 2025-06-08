"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Custom hook for fetching and managing user profile data
 * Handles authentication state and profile data fetching from Supabase
 * @returns Object containing profile data, loading state, error, and refresh function
 */
export function useProfile() {
    // Initialize Supabase client
    const supabase = createClient();

    // State for storing user profile data
    const [profile, setProfile] = useState({
        id: "",           // User's unique identifier
        firstName: "",    // User's first name
        lastName: "",     // User's last name
        bio: "",          // User's biography
        avatarUrl: "",    // URL to user's avatar image
        email: ""         // User's email address
    });
    
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState<string | null>(null);  // Error state

    /**
     * Fetches the current user's profile data from Supabase
     * Handles both authentication and profile data retrieval
     */
    const loadProfile = async () => {
        setLoading(true);
        
        try {
            // 1. Check for active session
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData?.session) {
                setError("No active session found");
                setLoading(false);
                return;
            }

            // 2. Get current user data
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                setError("User not found");
                setLoading(false);
                return;
            }

            // 3. Fetch additional profile data from profiles table
            const { data, error: profileError } = await supabase
                .from("profiles")
                .select("first_name, last_name, bio, avatar_url")
                .eq("id", userData.user.id)
                .maybeSingle();

            // 4. Handle profile data
            if (profileError) {
                setError(profileError.message);
            } else if (data) {
                // Update profile state with combined auth and profile data
                setProfile({
                    id: userData.user.id,
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    bio: data.bio || "",
                    avatarUrl: data.avatar_url || "",
                    email: userData.user.email || ""
                });
            }
        } catch (err) {
            console.error("Error loading profile:", err);
            setError("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    // Load profile data on component mount
    useEffect(() => {
        loadProfile();
    }, [supabase]);

    // Return profile data and utility functions
    return { 
        profile,   // User profile data
        loading,   // Loading state
        error,     // Error message if any
        refresh: loadProfile  // Function to manually refresh profile data
    };
}