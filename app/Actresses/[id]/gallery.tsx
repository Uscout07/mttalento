'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function GalleryPage() {
  const { id } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [actorName, setActorName] = useState<string>('');

  useEffect(() => {
    const fetchImages = async () => {
      const actorFolder = `/actors/${id}/images/`;
      const imagePaths = Array.from({ length: 10 }, (_, i) => `${actorFolder}${i + 1}.jpg`); // Assume 10 images per actor
      setImages(imagePaths);
      setActorName(`Actor ${id}`); // Replace with real name if available
    };

    fetchImages();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-500">{actorName} - Gallery</h1>
        <Link href="/">
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
              src={img}
              alt={`Actor Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-md hover:opacity-80"
              onClick={() => setZoomedImage(img)}
            />
          </div>
        ))}
      </div>

      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative">
            <img src={zoomedImage} alt="Zoomed" className="max-w-screen-md max-h-screen-md" />
            <button
              className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-700 p-2 rounded-full"
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
