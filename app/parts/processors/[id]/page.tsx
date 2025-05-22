import {createClient} from '@/utils/supabase/server';
import ProcessorDetail from '@/components/parts/ProcessorDetail';
import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";

type PageProps = {
    params: { id: string };
};

export const dynamic = 'force-dynamic'; // Optional: helpful if data updates often

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    return {
        title: `Processor Detail - ${params.id}`,
    };
}

export default async function ProcessorDetailPage({params}: PageProps) {
    const supabase = await createClient();

    const {data: allCpus} = await supabase
        .from('processors')
        .select('id, name')
        .order('id');

    const {data: cpu, error} = await supabase
        .from('processors')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !cpu) return notFound();

    // Find index of current cpu
    const index = allCpus?.findIndex((item) => item.id === params.id);
    const prev = index !== undefined && index > 0 ? allCpus?.[index - 1] : null;
    const next = index !== undefined && index < (allCpus?.length ?? 0) - 1 ? allCpus?.[index + 1] : null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <ProcessorDetail cpu={cpu}/>
            <div className="flex flex-col justify-center">
                <div className="border-t pt-4 flex flex-row justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        disabled={!prev}
                    >
                        <Link href={prev ? `/parts/processors/${prev.id}` : '#'}>
                            <ArrowLeftFromLine/>
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700"
                        disabled={!next}
                    >
                        <Link href={next ? `/parts/processors/${next.id}` : '#'}>
                            <ArrowRightFromLine/>
                        </Link>
                    </Button>

                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-1 rounded text-blue-600 hover:border-blue-700 hover:text-blue-700">
                    <Link href="/parts/processors">
                        Back to Processors
                    </Link>
                </Button>
            </div>

        </div>
    );
}
