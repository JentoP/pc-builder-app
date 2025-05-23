'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

export default function Tutorial() {
    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold text-center mb-12">PC Builder App Tutorial</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Getting Started */}
                <Card className="md:col-span-2 lg:col-span-1 bg-sidebar">
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-4">
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-white p-4">1</span>
                                <div>
                                    <h3 className="font-semibold">Create an Account</h3>
                                    <p className="text-sm text-muted-foreground">Sign up with your email or social media
                                        account to start building your PC.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-white p-4">2</span>
                                <div>
                                    <h3 className="font-semibold">Explore Components</h3>
                                    <p className="text-sm text-muted-foreground">Browse through our extensive library of
                                        CPU, GPU, RAM, and other components.</p>
                                </div>
                            </li>
                        </ol>
                    </CardContent>
                </Card>

                {/* Building Your PC */}
                <Card className="md:col-span-2 lg:col-span-1 bg-sidebar">
                    <CardHeader>
                        <CardTitle>Building Your PC</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-4">
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-white p-4">3</span>
                                <div>
                                    <h3 className="font-semibold">Select Components</h3>
                                    <p className="text-sm text-muted-foreground">Click "Add to Build" on components you
                                        want to include in your PC.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-white p-4">4</span>
                                <div>
                                    <h3 className="font-semibold">Check Compatibility</h3>
                                    <p className="text-sm text-muted-foreground">Our system automatically checks if your
                                        components are compatible.</p>
                                </div>
                            </li>
                        </ol>
                    </CardContent>
                </Card>

                {/* Saving and Sharing */}
                <Card className="md:col-span-2 lg:col-span-1 bg-sidebar">
                    <CardHeader>
                        <CardTitle>Saving and Sharing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-4">
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-white p-4">5</span>
                                <div>
                                    <h3 className="font-semibold">Save Your Build</h3>
                                    <p className="text-sm text-muted-foreground">Save your PC build to your profile for
                                        future reference.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-white p-4">6</span>
                                <div>
                                    <h3 className="font-semibold">Share with Others</h3>
                                    <p className="text-sm text-muted-foreground">Share your build with friends or get
                                        feedback from the community.</p>
                                </div>
                            </li>
                        </ol>
                    </CardContent>
                </Card>

                {/* Tips & Tricks */}
                <Card className="md:col-span-2 lg:col-span-1 bg-sidebar">
                    <CardHeader>
                        <CardTitle>Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-purple-700 flex items-center justify-center p-4 text-white">✓</span>
                                <div>
                                    <h3 className="font-semibold">Use the Drawer</h3>
                                    <p className="text-sm text-muted-foreground">Access the current build and manage
                                        your components from one place during selection.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span
                                    className="w-4 h-4 rounded-full bg-purple-700 flex items-center justify-center p-4 text-white">✓</span>
                                <div>
                                    <h3 className="font-semibold">Use the next up button</h3>
                                    <p className="text-sm text-muted-foreground">For your convenience, use the "Next Up"
                                        button in the drawer to select the next component to add to your build.</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Knowledge Base */}
                <Card className="md:col-span-2 lg:col-span-1 bg-sidebar">
                    <CardHeader>
                        <CardTitle>Good to know</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">

                            <li className="flex items-start gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full bg-purple-700 flex items-center justify-center p-4 text-white">✓</span>
                                <div>
                                    <h3 className="font-semibold">Head to the Dashboard</h3>
                                    <p className="text-sm text-muted-foreground">Access all your saved builds
                                        and manage your components from one place.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full bg-purple-700 flex items-center justify-center p-4 text-white">✓</span>
                                <div>
                                    <h3 className="font-semibold">Check Prices</h3>
                                    <p className="text-sm text-muted-foreground">Compare prices and find the
                                        best deals for your components.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full bg-purple-700 flex items-center justify-center p-4 text-white">✓</span>
                                <div>
                                    <h3 className="font-semibold">Read Specifications</h3>
                                    <p className="text-sm text-muted-foreground">Carefully review component
                                        specs to ensure they meet your requirements.</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 text-center">
                <Link href="/dashboard">
                    <Button variant="outline" className="mt-4 border border-blue-600 hover:bg-purple-700">
                        Start Building
                    </Button>
                </Link>
            </div>
        </div>
    );
}
