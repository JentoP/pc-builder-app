import { createClient } from '@/utils/supabase/server';
import GraphicCardDetail from '@/components/parts/GraphicCardDetail';
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
        title: `Graphic Card Detail - ${params.id}`,
    };
}

export default async function GraphicCardDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    const { data: allCards } = await supabase
        .from('graphic_cards')
        .select('id, name')
        .order('id');

    const { data: card, error } = await supabase
        .from('graphic_cards')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !card) return notFound();

    const index = allCards?.findIndex((item) => item.id === params.id);
    const prev = index !== undefined && index > 0 ? allCards?.[index - 1] : null;
    const next = index !== undefined && index < (allCards?.length ?? 0) - 1 ? allCards?.[index + 1] : null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <GraphicCardDetail card={card} />
            <div className="flex flex-col justify-center">
                <div className="border-t pt-4 flex flex-row justify-between">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!prev}>
                        <Link href={prev ? `/parts/graphic-cards/${prev.id}` : '#'}>
                            <ArrowLeftFromLine />
                        </Link>
                    </Button>
                        <Link href={next ? `/parts/graphic-cards/${next.id}` : '#'}>
                            <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700" disabled={!next}>
                            <ArrowRightFromLine />
                            </Button>
                        </Link>
                </div>
                <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Link href="/parts/graphic-cards">
                        Back to Graphic Cards
                    </Link>
                </Button>
            </div>
        </div>
    );
}
