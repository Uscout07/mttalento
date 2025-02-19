// app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

interface Profile {
    id: number;
    name: string;
    avatar_url: string;
    primary_image?: string;
}

export default async function Page() {
    // Use createServerComponentClient to only read cookies (and not modify them)
    const supabase = createServerComponentClient({ cookies });

    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    const cutoffDate = eighteenYearsAgo.toISOString().split('T')[0];

    const { data: profiles, error } = await supabase
        .from('profile')
        .select('*')
        .gt('birth_date', cutoffDate)

    if (error) {
        console.error('Error fetching profiles:', error);
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600">
                Error fetching profiles data.
            </div>
        );
    }

    if (!profiles || profiles.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                No profiles found.
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-0">
            <h1 className="text-3xl font-bold text-center mb-8 text-red-500">Actors</h1>
            <div className="max-w-[95%] mx-auto">
                <div className="flex flex-wrap justify-center gap-6">
                    {profiles.map((profile: Profile) => (
                        <Link
                            key={profile.id}
                            href={`/Actors/${profile.id}`}
                            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                        >
                            <div className="group relative w-full h-[32rem] shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500">
                                <img
                                    src={profile.primary_image || '/api/placeholder/420/650'}
                                    alt={profile.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                                />
                                <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-black/75 blur-xl rounded-md"></div>
                                        <h2 className="relative z-10 text-white text-4xl font-medium px-4 py-2">
                                            {profile.name}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
