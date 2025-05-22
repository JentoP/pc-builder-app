import { createClient } from '@/utils/supabase/server';
import PowerSupplyDetail from '@/components/parts/PowerSupplyDetail';
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
        title: `Power Supply Detail - ${params.id}`,
    };
}

export default async function PowerSupplyDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    const { data: allPsus } = await supabase
        .from('power_supplies')
        .select('id, name')
        .order('id');

    const { data: psu, error } = await supabase
        .from('power_supplies')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !psu) return notFound();

    const index = allPsus?.findIndex((item) => item.id === params.id);
    const prev = index !== undefined && index > 0 ? allPsus?.[index - 1] : null;
    const next = index !== undefined && index < (allPsus?.length ?? 0) - 1 ? allPsus?.[index + 1] : null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <PowerSupplyDetail psu={psu} />
            <div className="flex flex-col justify-center">
                <div className="border-t pt-4 flex flex-row justify-between">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!prev}>
                        <Link href={prev ? `/parts/power_supplies/${prev.id}` : '#'}>
                            <ArrowLeftFromLine />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!next}>
                        <Link href={next ? `/parts/power_supplies/${next.id}` : '#'}>
                            <ArrowRightFromLine />
                        </Link>
                    </Button>
                </div>
                <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Link href="/parts/power_supplies">
                        Back to Power Supplies
                    </Link>
                </Button>
            </div>
        </div>
    );
}
