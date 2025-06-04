import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { build } = await request.json();

    if (!build) {
      return NextResponse.json(
          { error: 'Build data is required' },
          { status: 400 }
      );
    }

    // Validate required build data
    if (!build.name || typeof build.name !== 'string') {
      return NextResponse.json(
          { error: 'Build name is required' },
          { status: 400 }
      );
    }

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
      );
    }

    // Check if build has at least one component
    const hasComponents = [
      'processor', 'motherboard', 'memory', 'storage',
      'cooling', 'psu', 'case', 'gpu'
    ].some(part => build[part] && (Array.isArray(build[part]) ? build[part].length > 0 : true));

    if (!hasComponents) {
      return NextResponse.json(
          { error: 'Build must contain at least one component' },
          { status: 400 }
      );
    }

    // Insert build into shared_builds table
    const { data, error } = await supabase
        .from('shared_builds')
        .insert([{
          name: build.name,
          build_data: {
            processor: build.processor,
            motherboard: build.motherboard,
            memory: build.memory,
            storage: build.storage,
            cooling: build.cooling,
            psu: build.psu,
            case: build.case,
            gpu: build.gpu
          },
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          views: 0
        }])
        .select()
        .single();

    if (error) {
      console.error('Error inserting build:', error);
      return NextResponse.json(
          { error: 'Failed to create shared build' },
          { status: 500 }
      );
    }

    const shareUrl = `/shared/${data.id}`;

    return NextResponse.json({
      url: shareUrl,
      id: data.id,
      share_url: shareUrl
    });

  } catch (error) {
    console.error('Error sharing build:', error);
    return NextResponse.json(
        { error: 'An unexpected error occurred while sharing the build' },
        { status: 500 }
    );
  }
}