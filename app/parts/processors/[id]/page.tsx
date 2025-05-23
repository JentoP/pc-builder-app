import {createClient} from '@/utils/supabase/server';
import ProcessorDetail from '@/components/parts/ProcessorDetail';
import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
    params: { id: string };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = params;
    return { title: `Processor Detail - ${id}` };
}

export default async function ProcessorDetailPage({ params }: PageProps) {
    const { id } = params;

    const supabase = await createClient();
    const { data: cpu, error } = await supabase
        .from('processors')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !cpu) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <ProcessorDetail cpu={cpu} />
            <div className="flex flex-col justify-center">
                <Link href="/parts/processors" className="w-full">
                    <Button variant="outline" size="sm" className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                        Back to Processors
                    </Button>
                </Link>
            </div>
        </div>
    );
}