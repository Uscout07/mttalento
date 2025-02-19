import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: NextRequest) {
    const session = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profile_id");

    if (!profileId) {
        return NextResponse.json({ error: "Missing profile_id" }, { status: 400 });
    }

    // Fetch the profile record to get the folder address from the images field
    const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("images")
        .eq("id", profileId)
        .single();

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const folderPath = profile?.images;
    if (!folderPath) {
        return NextResponse.json({ images: [] });
    }

    console.log('Fetching images from folder:', folderPath); // Log folder path for debugging

    const { data, error } = await supabase
        .storage
        .from("assets")
        .list(folderPath);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generate a public URL for each file
    const images = data.map((file) => {
        const { data: publicUrlData } = supabase
            .storage
            .from("assets")
            .getPublicUrl(`${folderPath}/${file.name}`);
        return { file_url: publicUrlData.publicUrl };
    });

    console.log('Fetched images:', images); // Log fetched images for debugging

    return NextResponse.json({ images });
}
