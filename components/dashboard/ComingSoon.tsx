'use client';

import { BookOpenCheck } from 'lucide-react';

export function ComingSoon() {
  return (
    <div className="bg-sidebar border rounded-lg my-8 p-12 shadow justify-between animate-fade-right animate-ease-in animate-delay-[2000ms] animate-duration-[2000ms]">
      <div className="flex flex-col items-center justify-between">
        <BookOpenCheck
          className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-[5500ms] animate-duration-[2000ms]"
        />
        <h3 className="text-lg font-semibold mb-1">Coming Soon</h3>
        <p className="text-muted-foreground">More features are on the way</p>
        <ul className="text-sm mt-4 text-muted-foreground text-center">
          <li>Compare parts</li>
          <li>Build sharing</li>
          <li>Price tracking</li>
          <li>Community builds</li>
          <li>Advanced compatibility checks</li>
          <li>Automatic fetching of new components</li>
        </ul>
      </div>
    </div>
  );
}
