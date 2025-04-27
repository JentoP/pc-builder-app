import {hasEnvVars} from "@/app/api/supabase/check-env-vars";
import {EnvVarWarning} from "@/components/nextjs/env-var-warning";
import HeaderAuth from "@/components/nextjs/header-auth";
import * as React from "react";

export default async function Home() {
    return (
        <>
            <main className="flex-1 flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Welcome to the PC Builder</h1>

                <h2 className="text-lg font-medium">Please sign in or register to use the application:</h2>
                {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
            </main>
        </>
    );
}
