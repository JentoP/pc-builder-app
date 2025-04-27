import {hasEnvVars} from "@/utils/supabase/check-env-vars";
import {EnvVarWarning} from "@/components/nextjs/env-var-warning";
import HeaderAuth from "@/components/nextjs/header-auth";
import * as React from "react";

export default async function Home() {
    return (
        <>
            <main className="flex-1 flex flex-col gap-6 px-4">
                <h1 className="font-medium text-lg mb-4">Hello</h1>
                <h2 className="font-medium text-lg">Please sign in or register to use the application:</h2>

                {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
            </main>
        </>
    );
}
