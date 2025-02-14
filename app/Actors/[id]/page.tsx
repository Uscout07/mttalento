'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../components/languageContext';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  type?: string;
}

const compressImage = async (file: File, options: CompressionOptions = {}): Promise<File> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    type = 'image/jpeg'
  } = options;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) throw new Error('Could not create blob');
            resolve(new File([blob], file.name, {
              type: type,
              lastModified: Date.now()
            }));
          },
          type,
          quality
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Enhanced Image Uploader Component with drag-and-drop
const ImageUploader = ({ onUpload, label, className = "" }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files');
      return;
    }

    try {
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        type: 'image/jpeg'
      });
      onUpload(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-8 w-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="mt-2 block text-sm font-medium text-gray-900">
            {isDragging ? 'Drop image here' : label}
          </span>
          <span className="mt-1 block text-xs text-gray-500">
            Drag and drop or click to upload
          </span>
        </div>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

// Modified supabaseClient with image handling
const supabaseClient = {
  uploadImage: async (file, actorName, isPrimary = false) => {
    try {
      const folderPath = `Actors/${actorName}/images`;
      const fileName = isPrimary ? 'primary.jpeg' : `${Date.now()}.jpeg`;
      const filePath = `${folderPath}/${fileName}`;

      // Ensure the file is compressed before upload
      const compressedFile = await compressImage(file, {
        maxWidth: isPrimary ? 800 : 1200, // Primary images can be smaller
        maxHeight: isPrimary ? 800 : 1200,
        quality: 0.8,
        type: 'image/jpeg'
      });

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      return filePath;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
};

const isJsonString = (str: string): boolean => {
  try {
  JSON.parse(str);
  return true;
  } catch (e) {
  return false;
  }
};

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

interface Profile {
  id: string;
  name: string;
  birth_date?: string;
  height?: string;
  weight?: string;
  nationality?:
  | {
    en?: string;
    es?: string;
    }
  | string;
  immigration_status?:
  | {
    en?: string;
    es?: string;
    }
  | string;
  primary_image?: string;
  appearance?: Appearance | string;
  socials?:
  | {
    instagram?: string;
    }
  | string;
  video_url?: string; // Add this field to your Profile interface
}

const ProfileContent = () => {
  const params = useParams();
  const { id } = params;
  const { translations, language } = useLanguage();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (typeof parsedData[field] === 'string' && isJsonString(parsedData[field])) {
        parsedData[field] = JSON.parse(parsedData[field]);
      }
      });

      setProfile(parsedData);
    }
    } catch (err: any) {
    console.error('Error fetching profile:', err);
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    } finally {
    setLoading(false);
    }
  };

  fetchProfile();
  }, [id]);

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

  const renderCredits = (credits: any[], title: string) => {
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

  const renderSkills = (skills: any[]) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="mt-6">
    <h3 className="text-xl font-bold mb-3">{translations.skills || 'Skills'}</h3>
    {skills.map((skillGroup, index) => (
      <div key={index} className="mb-4">
      {skillGroup.category && (
        <h4 className="font-medium text-gray-700 mb-2">{skillGroup.category}</h4>
      )}
      {skillGroup.skills && (
        <p className="text-gray-600">{skillGroup.skills.join(', ')}</p>
      )}
      </div>
    ))}
    </div>
  );
  };

  const renderTraining = (training: any[]) => {
  if (!training || training.length === 0) return null;

  return (
    <div className="mt-6">
    <h3 className="text-xl font-bold mb-3">{translations.training || 'Training'}</h3>
    {training.map((item, index) => (
      <div key={index} className="border-b border-gray-200 py-2">
      <p className="text-gray-600">
        {item.description}
        {item.year && ` (${item.year})`}
      </p>
      </div>
    ))}
    </div>
  );
  };

  return (
  <div className="p-4 max-w-6xl mx-auto">
    <header className="text-center mb-6 md:text-left">
    <h1 className="text-2xl font-bold">
      {profile ? profile.name : translations.profileNotFound}
    </h1>
    <h2 className="text-xl text-gray-600">
      {`${translations.profileOf} ${profile?.name || 'Unknown'}`}
    </h2>
    </header>

    {profile ? (
    <div>
      <div className="flex flex-col md:flex-row md:gap-8">
      <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
        <div className="sticky top-4">
        <Image
          src={profile.primary_image || '/fallback-image.png'}
          alt={profile.name}
          width={400}
          height={400}
          className="rounded-lg w-full h-auto object-cover"
        />
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <div className="space-y-2">
        <ProfileField
          label={translations.dateOfBirth}
          value={profile.birth_date}
        />
        <ProfileField
          label={translations.height}
          value={profile.height?.toString()}
        />
        <ProfileField
          label={translations.weight}
          value={profile.weight?.toString()}
        />
        <ProfileField
          label={translations.skin}
          value={
          typeof profile.appearance === 'object'
            ? profile.appearance?.[language]?.skin ||
            profile.appearance?.[language]?.piel ||
            'N/A'
            : profile.appearance || 'N/A'
          }
        />
        <ProfileField
          label={translations.hair}
          value={
          typeof profile.appearance === 'object'
            ? profile.appearance?.[language]?.hair ||
            profile.appearance?.[language]?.cabello ||
            'N/A'
            : profile.appearance || 'N/A'
          }
        />
        <ProfileField
          label={translations.eyes}
          value={
          typeof profile.appearance === 'object'
            ? profile.appearance?.[language]?.eyes ||
            profile.appearance?.[language]?.ojos ||
            'N/A'
            : profile.appearance || 'N/A'
          }
        />
        <ProfileField
          label={translations.nationality}
          value={
          typeof profile.nationality === 'string'
            ? profile.nationality
            : profile.nationality?.[language] || 'N/A'
          }
        />
        <ProfileField
          label={translations.immigrationStatus}
          value={
          typeof profile.immigration_status === 'string'
            ? profile.immigration_status
            : profile.immigration_status?.[language] ||
            'N/A'
          }
        />
        {profile.socials &&
          typeof profile.socials === 'object' &&
          profile.socials.instagram && (
          <ProfileField
            label="Instagram"
            value={profile.socials.instagram}
          />
          )}
        </div>

        {renderCredits(profile.television, translations.television || 'Television')}
        {renderCredits(profile.largometrajes, translations.featureFilms || 'Feature Films')}
        {renderCredits(profile.cortometrajes, translations.shortFilms || 'Short Films')}
        {renderCredits(profile.teatro, translations.theater || 'Theater')}
        {renderCredits(profile.serie_documental, translations.documentarySeries || 'Documentary Series')}
        {renderCredits(profile.doblaje_voz, translations.voiceover || 'Voice Over')}
        {renderTraining(profile.formacion)}
        {renderSkills(profile.habilidades)}
      </div>
      </div>

      {profile.video_url && (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">{translations.demoReel}</h2>
        <video
        src={profile.video_url}
        controls
        className="w-full h-auto"
        >
        Your browser does not support the video tag.
        </video>
      </div>
      )}
    </div>
    ) : (
    <div className="text-center text-gray-500">
      {translations.profileNotFound}
    </div>
    )}
  </div>
  );
};

const ProfileField = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => {
  if (!value || value === 'N/A') return null;

  return (
  <p className="flex justify-between border-b border-gray-200 py-2">
    <strong className="text-gray-700">{label}:</strong>
    <span className="text-gray-600">{value}</span>
  </p>
  );
};

export default ProfileContent;