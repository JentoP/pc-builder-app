import { createClient } from '@/utils/supabase/server';

export default async function Page() {
    const supabase = await createClient();
    const { data: processors } = await supabase.from('processors').select();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-medium">Graphic Cards</h1>
            <h2>These are all graphic cards, you can delete, edit or share them with others.</h2>
            <div className="justify-center flex gap-4">
                {/*List of processors*/}
            </div>
        </div>
    );
}