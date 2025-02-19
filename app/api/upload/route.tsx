import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        // Debugging: Log session
        console.log('Session:', session);

        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const profileId = formData.get('profile_id') as string;
        let name = formData.get('name') as string;

        if (!file || !profileId || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Get the existing profile data to check the folder path
        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('images')
            .eq('id', profileId)
            .single();

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 400 });
        }

        // If images path doesn't exist, create it
        let folderPath = profile.images;
        if (!folderPath) {
            // Create a safe folder name
            const safeName = name.replace(/\s+/g, '');
            folderPath = `actors/${safeName}/images`;

            // Update the profile with the new folder path
            const { error: updateError } = await supabase
                .from('profile')
                .update({ images: folderPath })
                .eq('id', profileId);

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 400 });
            }
        }

        // Upload the file using the folder path
        const filePath = `${folderPath}/${file.name}`;
        const { error: uploadError } = await supabase
            .storage
            .from('assets')
            .upload(filePath, file);

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 400 });
        }

        // Get the public URL
        const { data: publicUrlData } = supabase
            .storage
            .from('assets')
            .getPublicUrl(filePath);

        return NextResponse.json({
            message: 'File uploaded successfully',
            fileUrl: publicUrlData.publicUrl
        });
    } catch (error) {
        // Debugging: Log error
        console.error('Error:', error);
        return NextResponse.json({ error: (error as any).message }, { status: 500 });
    }
}
