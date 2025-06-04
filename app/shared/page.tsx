'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';

type SharedBuild = {
  id: string;
  created_at: string;
  build_data: {
    name: string;
    processor?: { name: string; manufacturer: string };
    totalPrice?: number;
  };
};

export default function SharedBuildsPage() {
  const [builds, setBuilds] = useState<SharedBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSharedBuilds = async () => {
      try {
        const { data, error } = await supabase
          .from('shared_builds')
          .select('id, created_at, build_data')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBuilds(data || []);
      } catch (err) {
        console.error('Error fetching shared builds:', err);
        setError('Failed to load shared builds');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedBuilds();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Shared Builds</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-sidebar rounded-lg p-4 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Shared Builds</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Shared Builds</h1>
      </div>

      {builds.length === 0 ? (
        <div className="text-center py-12">
          <Share2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No shared builds yet</h3>
          <p className="text-muted-foreground mt-2">
            Share a build to see it appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {builds.map((build) => (
            <div
              key={build.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-sidebar"
            >
              <Link href={`/shared/${build.id}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {build.build_data.name || 'Untitled Build'}
                    </h3>
                    {build.build_data.processor && (
                      <p className="text-sm text-muted-foreground">
                        {build.build_data.processor.manufacturer} {build.build_data.processor.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Shared on {formatDate(build.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    {build.build_data.totalPrice && (
                      <p className="font-semibold">
                        €{build.build_data.totalPrice.toFixed(2)}
                      </p>
                    )}
                    <Button variant="ghost" size="sm" className="text-blue-600" asChild>
                      <span>View Build</span>
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
