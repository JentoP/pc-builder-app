'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function About() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">About PC Builder App</h1>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-32">
            <p className="text-lg">
              Welcome to PC Builder App, a dynamic web application developed as a school project for Thomas More College. This platform helps users build their own custom PCs by selecting compatible components.
            </p>
            
            {/*<div className="flex flex-col md:flex-row gap-4 justify-center">*/}
            {/*  <Button asChild>*/}
            {/*    <Link href="https://jentopieters.be" className="flex items-center gap-2">*/}
            {/*      <span>Website</span>*/}
            {/*    </Link>*/}
            {/*  </Button>*/}
            {/*  <Button asChild variant="secondary">*/}
            {/*    <Link href="https://github.com/JentoP/pc-builder-app" target="_blank" className="flex items-center gap-2">*/}
            {/*      <span>Github</span>*/}
            {/*    </Link>*/}
            {/*  </Button>*/}
            {/*  <Button asChild variant="outline">*/}
            {/*    <Link href="https://www.linkedin.com/in/jpieters" target="_blank" className="flex items-center gap-2">*/}
            {/*      <span>LinkedIn</span>*/}
            {/*    </Link>*/}
            {/*  </Button>*/}
            {/*</div>*/}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 ">
              <Card className="bg-sidebar">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="font-medium">Developer:</span>
                      <span>Jento P</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Institution:</span>
                      <span>Thomas More College</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Course:</span>
                      <span>Dynamic Web Applications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-sidebar">
                <CardHeader>
                  <CardTitle>Technical Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="font-medium">Frontend:</span>
                      <span>Next.js 13+, Tailwind CSS</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Backend:</span>
                      <span>Supabase</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">UI Components:</span>
                      <span>Shadcn UI</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
