import { createClient } from '@/utils/supabase/server';
import StorageDetail from '@/components/parts/StorageDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PageProps = {
    params: { id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `Storage Detail - ${params.id}`,
    };
}

export default async function StorageDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    const { data: storage, error } = await supabase
        .from('storage')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !storage) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <StorageDetail storage={storage} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/storage" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Storage
                    </Button>
                </Link>
            </div>
        </div>
    );
}
