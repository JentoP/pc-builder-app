import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Define an interface for the expected request body
interface ShareBuildRequestBody {
  buildId: string;
}

// Define an expected type for the RPC response (assuming it's boolean)
type ToggleBuildSharingResponse = boolean;

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
      );
    }

    // Type the request body
    const { buildId } = (await req.json()) as ShareBuildRequestBody;

    if (!buildId) {
      return NextResponse.json(
          { error: 'buildId is required' },
          { status: 400 }
      );
    }

    // Call the RPC function and type its response
    const { data, error } = await supabase
        .rpc('toggle_build_sharing', {
          id: buildId
        })
        .single<ToggleBuildSharingResponse>();

    if (error) {
      // Include buildId in the server log for easier debugging
      console.error(`Database error for buildId ${buildId}:`, error.message);
      return NextResponse.json(
          { error: error.message || 'Failed to update share status' },
          { status: 403 } // Assuming 403 is appropriate for RPC errors like permissions
      );
    }

    return NextResponse.json({
      success: true,
      is_shared: data // data is now typed as boolean | null
    });

  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Log the actual error object for more details on the server
    console.error('Error in PATCH /api/share-build:', error);
    return NextResponse.json(
        {
          error: errorMessage,
        },
        { status: 500 }
    );
  }
}