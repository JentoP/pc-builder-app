import { createClient } from '@/utils/supabase/server';
import CoolerDetail from '@/components/parts/CoolerDetail';
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
        title: `Cooler Detail - ${id}`,
    };
}

export default async function CoolerDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: cooler, error } = await supabase
        .from('coolers')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !cooler) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <CoolerDetail cooler={cooler} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/cooling" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Coolers
                    </Button>
                </Link>
            </div>
        </div>
    );
}
