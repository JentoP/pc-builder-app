import {hasEnvVars} from "@/utils/supabase/check-env-vars";
import {EnvVarWarning} from "@/components/nextjs/env-var-warning";
import HeaderAuth from "@/components/nextjs/header-auth";
import * as React from "react";

export default async function Home() {
    return (
        <>
            <main className="flex-1 flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Welcome</h1>
            </main>
        </>
    );
}
