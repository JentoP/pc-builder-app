import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        
        // Get the build
        const { data: build, error: fetchError } = await supabase
            .from('builds')
            .select('*')
            .eq('id', params.id)
            .single();

        if (fetchError || !build) {
            console.error('Error fetching build:', fetchError);
            return NextResponse.json(
                { error: 'Build not found' },
                { status: 404 }
            );
        }

        // Only check if the build is shared
        if (!build.is_shared) {
            return NextResponse.json(
                { error: 'This build is private' },
                { status: 403 }
            );
        }

        return NextResponse.json({ build });
    } catch (error) {
        console.error('Error in GET /api/builds/[id]:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching the build' },
            { status: 500 }
        );
    }
}