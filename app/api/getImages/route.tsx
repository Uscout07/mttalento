import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url); // Correct way to get URL in App Router
        const profileId = url.searchParams.get('profile_id');

        if (!profileId) {
            return NextResponse.json({ error: "Missing profile_id" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('profile_images')
            .select('file_url')
            .eq('profile_id', profileId);

        if (error) throw error;

        return NextResponse.json({ images: data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
