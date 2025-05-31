'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
      <div className="p-4 max-w-10xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 animate-fade-right animate-ease-in">About</h1>
      <Card className="max-w-4xl mx-auto bg-sidebar">
        <CardHeader>
          <CardTitle className="text-2xl">Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-32">
            <p className="text-lg">
              Welcome to PC Builder App, a dynamic web application developed as a school project for Thomas More College. This platform helps users build their own custom PCs by selecting compatible components.
            </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="">
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

              <Card className="">
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
