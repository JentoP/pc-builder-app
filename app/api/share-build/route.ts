import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create client without service role key
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
);

type BuildData = {
  name: string;
  processor?: any;
  motherboard?: any;
  memory?: any[];
  storage?: any[];
  cooling?: any;
  psu?: any;
  case?: any;
  gpu?: any;
};

export async function POST(request: Request) {
  try {
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
        created_at: new Date().toISOString()
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

    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shared/${data.id}`;

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