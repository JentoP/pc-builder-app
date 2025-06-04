'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  onClick?: () => void;
  buttonVariant?: 'default' | 'purple';
  animationDelay?: string;
  external?: boolean;
}

export function DashboardCard({
  icon: Icon,
  title,
  description,
  buttonText,
  href,
  onClick,
  buttonVariant = 'default',
  animationDelay = '0ms',
  external = false,
}: DashboardCardProps) {
  const buttonClasses = {
    default: 'border-blue-800 hover:bg-blue-800',
    purple: 'border-purple-800 hover:bg-purple-800',
  };

  const content = (
    <div className="flex flex-col items-center justify-between">
      <Icon
        className={`mx-auto h-10 w-10 text-blue-600 mb-2 animate-rotate-y animate-once animate-ease-in-out animate-duration-[2000ms]`}
        style={{ animationDelay }}
      />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button
        onClick={onClick}
        className={`w-fit border rounded hover:text-white text-primary bg-sidebar min-w-24 ${buttonClasses[buttonVariant]}`}
      >
        {buttonText}
      </Button>
    </div>
  );

  return (
    <div className="bg-sidebar border rounded-lg p-5 shadow-sm flex flex-col justify-between">
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link href={href}>
          {content}
        </Link>
      )}
    </div>
  );
}
