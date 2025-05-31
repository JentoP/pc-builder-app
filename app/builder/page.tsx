'use client'

import BuildDisplay from "@/components/BuildDisplay";

export default function BuilderPage() {
    return (
        <div className="p-4 max-w-8xl mx-auto mb-10 space-y-4">
            <h1 className="text-3xl font-bold text-center">Build Your Computer</h1>
            <p className="text-muted-foreground text-center mx-auto">Build your dream PC with our easy-to-use builder</p>
            <BuildDisplay/>
        </div>
    )
}