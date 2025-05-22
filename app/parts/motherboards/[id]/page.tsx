import { createClient } from '@/utils/supabase/server';
import MotherboardDetail from '@/components/parts/MotherboardDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

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

    const { data: allMotherboards } = await supabase
        .from('motherboards')
        .select('id, name')
        .order('id');

    const { data: motherboard, error } = await supabase
        .from('motherboards')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !motherboard) return notFound();

    const index = allMotherboards?.findIndex((item) => item.id === params.id);
    const prev = index !== undefined && index > 0 ? allMotherboards?.[index - 1] : null;
    const next = index !== undefined && index < (allMotherboards?.length ?? 0) - 1 ? allMotherboards?.[index + 1] : null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <MotherboardDetail motherboard={motherboard} />
            <div className="flex flex-col justify-center">
                <div className="border-t pt-4 flex flex-row justify-between">
                    <Link href={prev ? `/parts/motherboards/${prev.id}` : '#'}>
                        <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!prev}>
                            <ArrowLeftFromLine />
                        </Button>
                    </Link>
                    <Link href={next ? `/parts/motherboards/${next.id}` : '#'}>
                        <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!next}>
                            <ArrowRightFromLine />
                        </Button>
                    </Link>
                </div>
                <Link href="/parts/motherboards">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Motherboards
                    </Button>
                </Link>
            </div>
        </div>
    );
}
