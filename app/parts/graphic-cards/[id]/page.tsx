import { createClient } from '@/utils/supabase/server';
import GraphicCardDetail from '@/components/parts/GraphicCardDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
    params: { id: string };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = params;
    return {
        title: `Graphic Card Detail - ${id}`,
    };
}

export default async function GraphicCardDetailPage({ params }: PageProps) {
    const { id } = params;
    const supabase = await createClient();

    const { data: card, error } = await supabase
        .from('graphic_cards')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !card) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <GraphicCardDetail card={card} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/graphic-cards" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Graphic Cards
                    </Button>
                </Link>
            </div>
        </div>
    );
}
