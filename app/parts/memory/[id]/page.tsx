import { createClient } from '@/utils/supabase/server';
import MemoryDetail from '@/components/parts/MemoryDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PageProps = {
    params: { id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const id = await params.id;
    return {
        title: `Memory Detail - ${id}`,
    };
}

export default async function MemoryDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    const { data: ram, error } = await supabase
        .from('memory')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !ram) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <MemoryDetail ram={ram} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/memory" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Memory
                    </Button>
                </Link>
            </div>
        </div>
    );
}
