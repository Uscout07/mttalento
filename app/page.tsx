'use client';
import { useEffect, useState } from 'react';
import PosterCarousel from "./components/PosterCarousel";
import { createClient } from "../utils/supabase/client"; // Ensure this points to your Supabase client setup
import { Icon } from "@iconify/react";

export default function Home() {
    const [posters, setPosters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosters = async () => {
            const supabase = createClient();

            // Step 1: Fetch primary image URLs directly from profile table
            const { data: profiles, error } = await supabase
                .from('profile')
                .select('primary_image');

            if (error) {
                console.error('Error fetching profile images:', error.message);
                return;
            }

            const validImages = profiles
                .map(profile => profile.primary_image)
                .filter(url => url); // Filter out empty or null entries

            // Step 2: Preload images before displaying
            const preloadImages = async () => {
                const imagePromises = validImages.map(
                    (src) =>
                        new Promise<string>((resolve, reject) => {
                            const img = new Image();
                            img.src = src;
                            img.onload = () => resolve(src);
                            img.onerror = () => reject(src);
                        })
                );

                try {
                    await Promise.all(imagePromises);
                    setPosters(validImages);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error loading images:", error);
                }
            };

            preloadImages();
        };

        fetchPosters();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-black text-white text-2xl">
                Loading images...
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background carousel */}
            <PosterCarousel images={posters} />

            {/* Main content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 px-4 Gill_Sans">
                <div className="w-[110%] h-[50%] blur-3xl opacity-60 absolute -z-10" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">MT TALENTO</h1>

                <p className="text-lg md:text-xl mb-6 flex items-center gap-2">
                    Made in
                    <Icon icon="twemoji:flag-mexico" className="w-6 h-6" />
                    <Icon icon="twemoji:flag-united-states" className="w-6 h-6" />
                </p>

                <div className="flex items-baseline justify-center gap-4 mb-6">
                    <Icon icon="skill-icons:instagram" className="w-8 h-8" />
                    <Icon icon="devicon:facebook" className="text-[2.1rem]" />
                </div>

                <button className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition duration-300">
                    CONTÁCTANOS
                </button>
            </div>
        </div>
    );
}
