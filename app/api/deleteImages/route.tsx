// /app/api/deleteImages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
    const session = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { fileUrl, profileId } = await req.json();
        if (!fileUrl || !profileId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Retrieve the profile to get the folder address stored in the images field.
        const { data: profileData, error: profileError } = await supabase
            .from('profile')
            .select('images')
            .eq('id', profileId)
            .single();

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 400 });
        }

        const folderPath = profileData.images;
        const publicUrlPrefix = `${supabaseUrl}/storage/v1/object/public/assets/`;

        if (!fileUrl.startsWith(publicUrlPrefix)) {
            return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
        }

        const relativePath = fileUrl.replace(publicUrlPrefix, '');

        // Verify the file is in the correct folder
        if (!relativePath.startsWith(folderPath)) {
            return NextResponse.json({ error: 'File does not belong to this profile' }, { status: 400 });
        }
        // Remove the prefix to get the relative path used in the bucket.

        // Remove the file from the "assets" bucket.
        const { error: removeError } = await supabase
            .storage
            .from('assets')
            .remove([relativePath]);

        if (removeError) {
            return NextResponse.json({ error: removeError.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'File deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
