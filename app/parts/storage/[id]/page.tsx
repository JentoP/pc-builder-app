import { createClient } from '@/utils/supabase/server';
import StorageDetail from '@/components/parts/StorageDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

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

    const { data: allStorage } = await supabase
        .from('storage')
        .select('id, name')
        .order('id');

    const { data: storage, error } = await supabase
        .from('storage')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !storage) return notFound();

    const index = allStorage?.findIndex((item) => item.id === params.id);
    const prev = index !== undefined && index > 0 ? allStorage?.[index - 1] : null;
    const next = index !== undefined && index < (allStorage?.length ?? 0) - 1 ? allStorage?.[index + 1] : null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <StorageDetail storage={storage} />
            <div className="flex flex-col justify-center">
                <div className="border-t pt-4 flex flex-row justify-between">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!prev}>
                        <Link href={prev ? `/parts/storage/${prev.id}` : '#'}>
                            <ArrowLeftFromLine />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!next}>
                        <Link href={next ? `/parts/storage/${next.id}` : '#'}>
                            <ArrowRightFromLine />
                        </Link>
                    </Button>
                </div>
                <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Link href="/parts/storage">
                        Back to Storage
                    </Link>
                </Button>
            </div>
        </div>
    );
}
