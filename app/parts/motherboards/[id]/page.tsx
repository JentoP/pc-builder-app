import { createClient } from '@/utils/supabase/server';
import MotherboardDetail from '@/components/parts/MotherboardDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PageProps = {
    params: { id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `Motherboard Detail - ${params.id}`,
    };
}

export default async function MotherboardDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    const { data: motherboard, error } = await supabase
        .from('motherboards')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !motherboard) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <MotherboardDetail motherboard={motherboard} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/motherboards" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Motherboards
                    </Button>
                </Link>
            </div>
        </div>
    );
}
