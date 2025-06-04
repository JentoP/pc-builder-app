'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type BuildData = {
  id?: string;
  name: string;
  processor?: any;
  motherboard?: any;
  memory?: any[];
  storage?: any[];
  cooling?: any;
  psu?: any;
  case?: any;
  gpu?: any;
};

const partDisplayOrder = [
  'processor',
  'motherboard',
  'memory',
  'gpu',
  'storage',
  'psu',
  'case',
  'cooling'
];

export default function SharedBuildPage() {
  const { id } = useParams();
  const router = useRouter();
  const [build, setBuild] = useState<BuildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchSharedBuild = async () => {
      try {
        const { data, error } = await supabase
          .from('shared_builds')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) {
          setError('Build not found');
          return;
        }

        // Increment view count
        await supabase
          .from('shared_builds')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);

        setBuild({
          ...data.build_data,
          id: data.id
        });
        setShareUrl(`${window.location.origin}/shared/${data.id}`);
      } catch (err) {
        console.error('Error fetching shared build:', err);
        setError('Failed to load build');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSharedBuild();
    }
  }, [id]);

  const copyToClipboard = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const renderPart = (part: any, partType: string) => {
    if (!part) return null;

    const imageKey = partType === 'gpu' ? 'graphic-card' : partType;
    const imageUrl = part.image_url || `/images/icons/gradient/${imageKey}.png`;
    const displayName = {
      processor: 'Processor',
      motherboard: 'Motherboard',
      memory: 'Memory',
      storage: 'Storage',
      cooling: 'Cooling',
      psu: 'Power Supply',
      case: 'Case',
      gpu: 'Graphics Card'
    }[partType];

    return (
      <div key={partType} className="bg-sidebar shadow rounded-lg p-6 border mb-4">
        <div className="flex items-start gap-4">
          <img 
            src={imageUrl} 
            alt={part.name} 
            className="w-24 h-24 object-contain bg-white p-2 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/images/icons/gradient/${imageKey}.png`;
            }}
          />
          <div className="flex-1 p-4 rounded-lg w-full">
            <h3 className="text-lg font-semibold mb-2">{displayName}</h3>
            <p className="font-medium">{part.manufacturer} {part.name}</p>
            
            {/* Display up to 3 key specifications */}
            <div className="mt-3 space-y-1">
              {Object.entries(part)
                .filter(([key]) => 
                  !['id', 'name', 'manufacturer', 'image_url', 'created_at', 'updated_at'].includes(key)
                )
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="font-medium">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                ))}
            </div>
            
            {part.price && (
              <div className="mt-3 pt-3 border-t">
                <span className="text-xl font-semibold">
                  €{typeof part.price === 'number' ? part.price.toFixed(2) : part.price}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error || !build) {
    return (
      <div className="container mx-auto p-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Build Not Found</h1>
        <p className="mb-6 text-muted-foreground">{error || 'The requested build could not be found.'}</p>
        <Button asChild>
          <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white">
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const totalPrice = [
    build.processor?.price || 0,
    build.motherboard?.price || 0,
    build.cooling?.price || 0,
    build.gpu?.price || 0,
    ...(build.memory || []).map((m: any) => m.price || 0),
    ...(build.storage || []).map((s: any) => s.price || 0),
    build.psu?.price || 0,
    build.case?.price || 0,
  ].reduce((sum, price) => sum + (Number(price) || 0), 0);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
          className="w-auto mt-3 px-4 py-1 rounded text-blue-600 border-blue-600 hover:border-blue-700 hover:text-blue-700"
        >
          Back
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setIsShareDialogOpen(true)}
          className="flex items-center gap-2 text-purple-600 border-purple-600 hover:bg-purple-50 hover:border-purple-700 hover:text-purple-700"
        >
          <Share2 size={16} />
          Share
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2">{build.name}</h1>
      
      <div className="mt-8 space-y-6">
        {partDisplayOrder.map(partType => {
          const part = build[partType as keyof BuildData];
          if (Array.isArray(part)) {
            return part.map((p, index) => renderPart(p, `${partType}[${index}]`));
          }
          return renderPart(part, partType);
        })}
      </div>

      <div className="mt-8 p-6 bg-sidebar rounded-lg border">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Total Price</h3>
          <span className="text-2xl font-bold">€{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share This Build</DialogTitle>
            <DialogDescription>
              Share this link with others to show them this build!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="px-3" 
              onClick={copyToClipboard}
            >
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
