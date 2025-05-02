import {signOutAction} from "@/app/actions"
import {hasEnvVars} from "@/supabase/check-env-vars"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {createClient} from "@/supabase/server"
import * as React from "react"

export default async function AuthButton() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!hasEnvVars) {
        return (
            <div className="flex gap-4 items-center">
                <Badge variant="default" className="font-normal pointer-events-none">
                    Please update .env.local file with anon key and url
                </Badge>
                <div className="row gap-2">
                    <Button asChild size="sm" variant="outline" disabled>
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild size="sm" variant="default" disabled>
                        <Link href="/sign-up">Sign up</Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (user) {
        // Fetch user profile from 'profiles' table
        const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", user.id)
            .maybeSingle()

        const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : user.email

        return (
            <div className="flex items-center gap-4">
                Hey, {name}!
                <form action={signOutAction}>
                    <Button type="submit" variant="outline">
                        Sign out
                    </Button>
                </form>
            </div>
        )
    }

    return (
        <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
                <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant="default">
                <Link href="/sign-up">Sign up</Link>
            </Button>
        </div>
    )
}