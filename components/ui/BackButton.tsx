'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
  className?: string;
  href?: string;
}

export default function BackButton({ 
  className = '',
  href
}: BackButtonProps) {
  const router = useRouter();
  
  const button = (
    <Button 
      variant="secondary" 
      size="icon" 
      className={`size-8 mr-2 ${className} shadow hover:shadow-md transition-all duration-200 bg-sidebar font-semibold`}
      asChild={!!href}
    >
      <span>
        <ArrowLeft className="h-4 w-4" />
      </span>
    </Button>
  );

  if (href) {
    return (
      <Link href={href}>
        {button}
      </Link>
    );
  }

  return (
    <div onClick={() => router.back()}>
      {button}
    </div>
  );
}
