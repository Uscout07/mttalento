import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
    try {
        // Validate and sanitize the profile_id parameter
        const url = new URL(req.url);
        const profileId = url.searchParams.get('profile_id');

        if (!profileId) {
            return NextResponse.json(
                { error: "Missing profile_id parameter" },
                { status: 400 }
            );
        }

        // Validate profile_id format (assuming it should be a number or UUID)
        // Modify this validation based on your specific requirements
        if (!/^\d+$/.test(profileId) && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(profileId)) {
            return NextResponse.json(
                { error: "Invalid profile_id format" },
                { status: 400 }
            );
        }

        // Query Supabase
        const { data, error } = await supabase
            .from('profile_images')
            .select('file_url')
            .eq('profile_id', profileId);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: "Database query failed" },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { images: [] },
                { status: 200 }
            );
        }

        return NextResponse.json({ images: data }, { status: 200 });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}