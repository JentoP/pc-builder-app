import { createClient } from '@/utils/supabase/server';
import PowerSupplyDetail from '@/components/parts/PowerSupplyDetail';
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
        title: `Power Supply Detail - ${id}`,
    };
}

export default async function PowerSupplyDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: psu, error } = await supabase
        .from('power_supplies')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !psu) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <PowerSupplyDetail psu={psu} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/power-supplies" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Power Supplies
                    </Button>
                </Link>
            </div>
        </div>
    );
}
