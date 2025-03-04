'use client';
import React, { useState, useEffect } from "react";
import { useLanguage } from "../components/languageContext";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Page = () => {
  const { translations, language } = useLanguage();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        const cutoffDate = eighteenYearsAgo.toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .lte("birth_date", cutoffDate)
          .eq("gender", "Male");

        if (error) throw error;

        setProfiles(data || []);
      } catch (err) {
        setError("Error fetching profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        {translations.profileNotFound || "No profiles found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-0">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-500">
        {translations.actors}
      </h1>
      <div className="max-w-[95%] mx-auto">
        <div className="flex flex-wrap justify-center gap-6">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/Actors/${profile.id}`}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              <div className="group relative w-full h-[32rem] shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500">
                <img
                  src={profile.primary_image || "/api/placeholder/420/650"}
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
};

export default Page;
