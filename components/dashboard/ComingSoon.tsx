'use client';

import { BookOpenCheck } from 'lucide-react';

export function ComingSoon() {
  return (
    <div className="bg-sidebar border rounded-lg my-4 p-8 shadow justify-between animate-fade-right animate-ease-in animate-delay-500 animate-duration-500">
      <div className="flex flex-col items-center justify-between">
        <BookOpenCheck
          className="mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-delay-1000 animate-duration-1000"
        />
        <h3 className="text-lg font-semibold mb-1">Coming Soon</h3>
        <p className="text-muted-foreground">More features are on the way</p>
        <ul className="text-sm mt-4 text-muted-foreground text-center">
          <li>Compare parts</li>
          <li>Price tracking</li>
          <li>Edit exisiting builds</li>
          <li>Admin controls</li>
          <li>Community builds</li>
          <li>Advanced compatibility checks</li>
          <li>Automatic fetching of new components</li>
        </ul>
      </div>
    </div>
  );
}
