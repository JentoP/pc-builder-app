import { createClient } from '@/utils/supabase/server'

export default async function Page() {
    const supabase = await createClient()
    const { data: processors } = await supabase.from('processors').select()

    return <pre>{JSON.stringify(processors, null, 2)}</pre>
}