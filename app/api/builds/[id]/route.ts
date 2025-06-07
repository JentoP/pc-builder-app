import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;
        const supabase = await createClient();

        // Get the build
        const { data: build, error: fetchError } = await supabase
            .from('builds')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !build) {
            console.error('Error fetching build:', fetchError);
            return NextResponse.json(
                { error: 'Build not found' },
                { status: 404 }
            );
        }

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