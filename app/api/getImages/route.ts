// app/api/getImages/route.ts   <- Note: .ts not .tsx
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define response type
type ImageResponse = {
    file_url: string;
}

export async function GET(request: NextRequest) {
    try {
        const profileId = request.nextUrl.searchParams.get('profile_id');

        if (!profileId) {
            return NextResponse.json(
                { error: "Missing profile_id parameter" }, 
                { status: 400 }
            );
        }

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

        return NextResponse.json({ 
            images: data || [] 
        }, { 
            status: 200 
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}