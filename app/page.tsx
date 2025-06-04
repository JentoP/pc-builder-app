'use client'

import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {PcCaseIcon, Rocket, Settings, ShieldCheck} from 'lucide-react'

export default function HomePage() {
    return (
        <div className="p-4 max-w-10xl mx-auto">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-2 animate-fade-right animate-ease-in">Build Your Dream
                    Computer</h1>
                <p className="text-muted-foreground text-lg  animate-fade-right animate-ease-in ">PC Builder is an
                    easy-to-use tool that helps you build the perfect PC.</p>
                <div
                    className="bg-sidebar border p-8 rounded-lg shadow-sm text-center mt-8 animate-fade-right animate-ease-in animate-delay-500">
                    <PcCaseIcon
                        className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-delay-[500ms]  animate-ease-in-out animate-duration-[2000ms]"/>
                    <h3 className="text-xl font-semibold mb-1 ">Start Building</h3>
                    <p className="text-muted-foreground text-sm">Select compatible parts and save your perfect
                        build.</p>
                    <Link href="/tutorial">
                        <Button
                            variant="outline"
                            className="mt-3 px-4 py-1 rounded border-blue-800 hover:bg-blue-800 hover:text-white text-primary bg-sidebar shadow mt-8 animate-jump-in animate-once animate-duration-[3000ms] animate-ease-in-out">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </section>
            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
                <div
                    className="bg-sidebar border p-6 rounded-lg shadow-sm text-center animate-fade-right animate-ease-in animate-delay-[1500ms]">
                    <Rocket
                        className="mx-auto h-10 w-10 text-purple-600 mb-2 animate-rotate-y animate-once animate-delay-[1500ms] animate-ease-in-out animate-duration-[2000ms]"/>
                    <h3 className="text-xl font-semibold mb-1 ">Fast & Easy</h3>
                    <p className="text-muted-foreground text-sm">Quickly select parts from a huge library and build your
                        rig in minutes.</p>
                </div>

                <div
                    className="bg-sidebar border p-6 rounded-lg shadow-sm text-center animate-fade-right animate-ease-in animate-delay-[2000ms]">
                    <Settings
                        className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-delay-[2000ms]  animate-ease-in-out animate-duration-[2000ms]"/>
                    <h3 className="text-xl font-semibold mb-1">Smart Compatibility</h3>
                    <p className="text-muted-foreground text-sm">Only see parts that work together. No more
                        guesswork.</p>
                </div>

                <div
                    className="bg-sidebar border p-6 rounded-lg shadow-sm text-center animate-fade-right animate-ease-in animate-delay-[2500ms]">
                    <ShieldCheck
                        className="mx-auto h-10 w-10 text-purple-400 mb-2 animate-rotate-y animate-once animate-delay-[2500ms]  animate-ease-in-out animate-duration-[2000ms]"/>
                    <h3 className="text-xl font-semibold mb-1">Save & Share</h3>
                    <p className="text-muted-foreground text-sm">Save builds to your account or share them with
                        friends.</p>
                </div>
            </section>
        </div>
    )
}
