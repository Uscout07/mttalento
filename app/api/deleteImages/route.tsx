import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are not set');
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req: NextRequest) {
    try {
        const { fileUrl, profileId, name } = await req.json();

        if (!fileUrl || !profileId || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Ensure fileUrl is a relative path (not an absolute URL)
        if (!fileUrl.startsWith('/')) {
            return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
        }

        // Remove spaces from the name
        const sanitizedFileName = name.replace(/\s+/g, '');

        // Construct the full path
        const fullPath = join(process.cwd(), 'public', fileUrl);

        // Delete the file from the server (if it exists)
        try {
            await unlink(fullPath);
        } catch (fsError) {
            console.warn('File not found or already deleted:', fullPath);
        }

        // Remove the entry from Supabase
        const { error } = await supabase
            .from('profile_images')
            .delete()
            .match({ profile_id: profileId, file_url: fileUrl });

        if (error) throw error;

        return NextResponse.json({ message: 'Image deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
