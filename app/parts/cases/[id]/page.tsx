import { createClient } from '@/utils/supabase/server';
import CaseDetail from '@/components/parts/CaseDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Case Detail - ${id}`,
    };
}

export default async function CaseDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: pcCase, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !pcCase) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <CaseDetail pcCase={pcCase} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/cases" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Cases
                    </Button>
                </Link>
            </div>
        </div>
    );
}
