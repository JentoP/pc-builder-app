'use client'

import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {Rocket, Settings, ShieldCheck} from 'lucide-react'
import SignInWarning from "@/components/SignInWarning";

export default function HomePage() {
    return (
        <div className="p-4 max-w-6xl mx-auto">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-2">Build Your Dream PC</h1>
                <p className="text-muted-foreground text-lg">
                    Select compatible parts and save your perfect build.
                </p>

                <div className="mt-6">
                    <Link href="/builder">
                        <Button
                            className="bg-purple-600 hover:bg-blue-700 text-white px-6 py-3 text-md rounded-lg shadow">
                            Start Building
                        </Button>
                    </Link>
                </div>
            </section>
            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
                <div className="bg-sidebar border p-6 rounded-lg shadow-sm text-center">
                    <Rocket className="mx-auto h-10 w-10 text-purple-600 mb-2"/>
                    <h3 className="text-xl font-semibold mb-1">Fast & Easy</h3>
                    <p className="text-muted-foreground text-sm">Quickly select parts from a huge library and build your
                        rig in minutes.</p>
                </div>

                <div className="bg-sidebar border p-6 rounded-lg shadow-sm text-center">
                    <Settings className="mx-auto h-10 w-10 text-blue-600 mb-2"/>
                    <h3 className="text-xl font-semibold mb-1">Smart Compatibility</h3>
                    <p className="text-muted-foreground text-sm">Only see parts that work together. No more
                        guesswork.</p>
                </div>

                <div className="bg-sidebar border p-6 rounded-lg shadow-sm text-center">
                    <ShieldCheck className="mx-auto h-10 w-10 text-purple-400 mb-2"/>
                    <h3 className="text-xl font-semibold mb-1">Save & Share</h3>
                    <p className="text-muted-foreground text-sm">Save builds to your account or share them with
                        friends.</p>
                </div>
            </section>

            {/* Sign in Prompt */}
            <SignInWarning/>
        </div>
    )
}
