'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GalleryPage() {
  const { id } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [] = useState<string>('');

  useEffect(() => {
    const fetchImages = async () => {
      const { error } = await supabase
        .storage
        .from('assets')
        .list(`actors/${id}/images`, { limit: 10 });

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('name')
        .eq('id', id)
        .single();

      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const actorFolder = `actors/${profileData.name
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
    };

    fetchImages();
  }, [id]);

  return (
    <div className="min-h-screen text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href={`/Actors/${id}`}>
          <button className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md">
            <Icon icon="mdi:arrow-left" className="text-2xl" />
            Back
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative cursor-pointer">
            <img
              src={`${img}`}
              alt={`Actor Image ${index + 1}`}
              className="w-full h-full hover:opacity-80"
              onClick={() => setZoomedImage(img)}
            />
          </div>
        ))}
      </div>

      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative h-screen">
            <img src={zoomedImage} alt="Zoomed" className="h-[90%] object-cover" />
            <button
              className="absolute top-8 right-4 text-white bg-red-500 hover:bg-red-700 p-2 rounded-full z-50"
              onClick={() => setZoomedImage(null)}
            >
              <Icon icon="mdi:close" className="text-3xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
