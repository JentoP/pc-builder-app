import { createClient } from '@/utils/supabase/server';
import CoolerDetail from '@/components/parts/CoolerDetail';
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
        title: `Cooler Detail - ${params.id}`,
    };
}

export default async function CoolerDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    const { data: allCoolers } = await supabase
        .from('coolers')
        .select('id, name')
        .order('id');

    const { data: cooler, error } = await supabase
        .from('coolers')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !cooler) return notFound();

    const index = allCoolers?.findIndex((item) => item.id === params.id);
    const prev = index !== undefined && index > 0 ? allCoolers?.[index - 1] : null;
    const next = index !== undefined && index < (allCoolers?.length ?? 0) - 1 ? allCoolers?.[index + 1] : null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <CoolerDetail cooler={cooler} />
            <div className="flex flex-col justify-center">
                <div className="border-t pt-4 flex flex-row justify-between">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!prev}>
                        <Link href={prev ? `/parts/coolers/${prev.id}` : '#'}>
                            <ArrowLeftFromLine />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!next}>
                        <Link href={next ? `/parts/coolers/${next.id}` : '#'}>
                            <ArrowRightFromLine />
                        </Link>
                    </Button>
                </div>
                <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Link href="/parts/coolers">
                        Back to Coolers
                    </Link>
                </Button>
            </div>
        </div>
    );
}
