'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from 'next/navigation';
import { useLanguage } from '../../components/languageContext';
import { createClient } from '@supabase/supabase-js';

// Type definitions
type Language = 'en' | 'es';

interface Appearance {
  en?: {
    eyes?: string;
    hair?: string;
    skin?: string;
  };
  es?: {
    ojos?: string;
    cabello?: string;
    piel?: string;
  };
}

interface Credit {
  title: string;
  role: string;
  year?: string;
  years?: string;
  network?: string;
  director?: string;
  production?: string;
}

interface Skill {
  category?: string;
  skills?: string[];
}

interface Training {
  description: string;
  year?: string;
}

interface Profile {
  id: string;
  name: string;
  birth_date?: string;
  height?: string;
  weight?: string;
  nationality?: {
    en?: string;
    es?: string;
  } | string;
  immigration_status?: {
    en?: string;
    es?: string;
  } | string;
  primary_image?: string;
  appearance?: Appearance | string;
  socials?: {
    instagram?: string;
  } | string;
  video_url?: string;
  television?: Credit[];
  largometrajes?: Credit[];
  cortometrajes?: Credit[];
  teatro?: Credit[];
  formacion?: Training[];
  habilidades?: Skill[];
  serie_documental?: Credit[];
  doblaje_voz?: Credit[];
}

// Initialize Supabase client (ensure your env variables are set)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper to check if a string is valid JSON
const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

interface ProfileFieldProps {
  label: string;
  value?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
  if (!value || value === 'N/A') return null;

  return (
    <p className="flex justify-between border-b border-gray-200 py-2">
      <strong className="text-gray-700">{label}:</strong>
      <span className="text-gray-600">{value}</span>
    </p>
  );
};

const ProfileContent: React.FC = () => {
  const params = useParams();
  const { id } = params; // Extract profile id from URL params

  // Cast language context to our expected type
  const { translations, language } = useLanguage() as unknown as {
    translations: Record<string, string>;
    language: Language;
  };

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('No profile ID provided');
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        if (data) {
          // Fields that might be stored as JSON strings
          const jsonFields = [
            'appearance',
            'nationality',
            'immigration_status',
            'socials',
            'television',
            'largometrajes',
            'cortometrajes',
            'teatro',
            'formacion',
            'habilidades',
            'serie_documental',
            'doblaje_voz'
          ];

          const parsedData = { ...data };

          jsonFields.forEach(field => {
            if (
              typeof parsedData[field] === 'string' &&
              isJsonString(parsedData[field])
            ) {
              parsedData[field] = JSON.parse(parsedData[field]);
            }
          });

          setProfile(parsedData as Profile);

          // Load images dynamically from Supabase storage
          const actorFolder = `actors/${data.name
            .normalize("NFD") // Normalize to decomposed Unicode (e.g., "é" → "é")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
            .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters
            }/images/`;

          const { data: files, error: storageError } = await supabase
            .storage
            .from('assets')
            .list(actorFolder);

          if (storageError) throw storageError;

          const imagePaths = files.map(file => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${actorFolder}${file.name}`);

          setImages(imagePaths);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Rotate images every 5 minutes
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [id, images.length]);

  // Render credits (e.g., television, films, etc.)
  const renderCredits = (credits: Credit[] | undefined, title: string) => {
    if (!credits || credits.length === 0) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="space-y-2">
          {credits.map((credit, index) => (
            <div key={index} className="border-b border-gray-200 py-2">
              <p className="font-medium">{credit.title}</p>
              <p className="text-gray-600">
                {credit.role}
                {credit.year && ` (${credit.year})`}
                {credit.years && ` (${credit.years})`}
                {credit.network && ` - ${credit.network}`}
                {credit.director && ` - Dir. ${credit.director}`}
                {credit.production && ` - ${credit.production}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = (skills: any) => {
    if (!Array.isArray(skills) || skills.length === 0) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-3">{translations.skills || "Skills"}</h3>
        {skills.map((skillGroup: any, index: number) => (
          <div key={index} className="mb-4">
            {/* Display category in the selected language */}
            {skillGroup.category && (
              <h4 className="font-medium text-gray-700 mb-2">
                {skillGroup.category[language] || skillGroup.category.en || skillGroup.category.es}
              </h4>
            )}
            {/* Display skills in the selected language */}
            {skillGroup.skills && (
              <p className="text-gray-600">
                {skillGroup.skills[language] ? skillGroup.skills[language].join(", ") : ""}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };


  const renderTraining = (training: Training[] | undefined) => {
    if (!training || training.length === 0) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-3">{translations.training || "Training"}</h3>
        {training.map((item, index) => (
          <div key={index} className="border-b border-gray-200 py-2">
            <p className="text-gray-600">
              {typeof item.description === "object"
                ? item.description[language] // Use translated text based on selected language
                : item.description}
              {item.year && ` (${item.year})`}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Render appearance details with correct property names based on language
  const renderAppearance = () => {
    if (typeof profile?.appearance === 'object') {
      let skin: string | undefined, hair: string | undefined, eyes: string | undefined;
      if (language === 'en') {
        skin = profile.appearance?.[language]?.skin;
        hair = profile.appearance?.[language]?.hair;
        eyes = profile.appearance?.[language]?.eyes;
      } else {
        // For Spanish: use "piel", "cabello", "ojos"
        skin = (profile.appearance as any)?.[language]?.piel;
        hair = (profile.appearance as any)?.[language]?.cabello;
        eyes = (profile.appearance as any)?.[language]?.ojos;
      }
      return (
        <>
          <ProfileField label={translations.skin || 'Skin'} value={skin || 'N/A'} />
          <ProfileField label={translations.hair || 'Hair'} value={hair || 'N/A'} />
          <ProfileField label={translations.eyes || 'Eyes'} value={eyes || 'N/A'} />
        </>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-500">
        {translations.profileNotFound || 'Profile not found'}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="text-center mb-6 md:text-left">
        <h1 className="text-2xl font-bold">{profile.name || translations.profileNotFound}</h1>
      </header>
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
          <div className="sticky top-4 flex justify-center group w-full h-[32rem] overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500">
            {images.length > 0 && (
              <Link href={`/Actors/${id}/gallery`}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex} // Ensures animation runs on index change
                    src={images[currentIndex]}
                    alt={profile.name || "Profile Image"}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }} // Ensures smooth transition when switching images
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </AnimatePresence>
              </Link>
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <ProfileField
            label={translations.dateOfBirth || 'Date of Birth'}
            value={profile.birth_date}
          />
          <ProfileField
            label={translations.height || 'Height'}
            value={profile.height?.toString()}
          />
          <ProfileField
            label={translations.weight || 'Weight'}
            value={profile.weight?.toString()}
          />
          {renderAppearance()}
          <ProfileField
            label={translations.nationality || 'Nationality'}
            value={
              typeof profile.nationality === 'string'
                ? profile.nationality
                : profile.nationality?.[language] || 'N/A'
            }
          />
          <ProfileField
            label={translations.immigrationStatus || 'Immigration Status'}
            value={
              typeof profile.immigration_status === 'string'
                ? profile.immigration_status
                : profile.immigration_status?.[language] || 'N/A'
            }
          />
          {profile.socials &&
            typeof profile.socials === 'object' &&
            profile.socials.instagram && (
              <ProfileField label="Instagram" value={profile.socials.instagram} />
            )}
          {renderCredits(profile.television, translations.television || 'Television')}
          {renderCredits(profile.largometrajes, translations.featureFilms || 'Feature Films')}
          {renderCredits(profile.cortometrajes, translations.shortFilms || 'Short Films')}
          {renderCredits(profile.teatro, translations.theater || 'Theater')}
          {renderCredits(profile.serie_documental, translations.documentarySeries || 'Documentary Series')}
          {renderCredits(profile.doblaje_voz, translations.voiceover || 'Voice Over')}
          {renderTraining(profile.formacion)}
          {renderSkills(profile.habilidades)}
          {profile.video_url && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                {translations.demoReel || 'Demo Reel'}
              </h2>
              <video src={profile.video_url} controls className="w-full h-auto">
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
