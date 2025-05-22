import { createClient } from '@/utils/supabase/server';
import CpuDetail from '@/components/parts/ProcessorDetail';
import { notFound } from 'next/navigation';

export default async function ProcessorDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: cpu, error } = await supabase
        .from('processors')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !cpu) return notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <CpuDetail cpu={cpu} />
        </div>
    );
}
