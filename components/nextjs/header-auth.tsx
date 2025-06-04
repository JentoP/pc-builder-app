import {signOutAction} from "@/app/actions"
import {hasEnvVars} from "@/utils/supabase/check-env-vars"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {createClient} from "@/utils/supabase/server"
import * as React from "react"
import BuildDrawer from "@/components/BuildDrawer";

export default async function AuthButton() {
    const supabase = await createClient()

    const {
        data: {user},
    } = await supabase.auth.getUser()

    if (!hasEnvVars) {
        return (
            <div className="flex gap-4 items-center animate-pulse duration-[3000ms] ease-in-out">
                <Badge variant="default" className="font-normal pointer-events-none">
                    <span className="text-xs">Missing environment variables</span>
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
        const {data: profile} = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", user.id)
            .maybeSingle()

        const name = profile ? `${profile.first_name} ${profile.last_name}`.trim() : user.email
        return (
            <BuildDrawer/>
        )
    }

    return (
        <div className="flex gap-2">
            <Button asChild size="sm" className="border rounded border-blue-700 hover:bg-blue-700 text-primary bg-sidebar shadow">
                <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="border rounded border-purple-700 hover:bg-purple-700 text-primary bg-sidebar shadow">
                <Link href="/sign-up">Sign up</Link>
            </Button>
        </div>
    )
}