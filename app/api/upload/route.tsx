import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const profileId = formData.get('profile_id') as string;
        let name = formData.get('name') as string;

        if (!file || !profileId || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Remove spaces from actor's name
        name = name.replace(/\s+/g, '');

        const filePath = `/public/actors/${name}/images/${file.name}`;
        const fileBuffer = await file.arrayBuffer();
        await writeFile(join(process.cwd(), filePath), Buffer.from(fileBuffer));

        // Save file URL in Supabase database
        const { error } = await supabase.from('profile_images').insert({
            profile_id: profileId,
            file_url: filePath.replace('/public', ''), // Save relative path
        });

        if (error) throw error;

        return NextResponse.json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
