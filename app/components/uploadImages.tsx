// components/uploadImages.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageData {
  file_url: string;
}

interface UploadImageProps {
  profileId?: string; // Made optional
  name?: string;      // Made optional
}

const UploadImage = ({ profileId, name }: UploadImageProps) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch images only if profileId exists
  const fetchImages = async () => {
    if (!profileId) return;
    try {
      const encodedProfileId = encodeURIComponent(profileId);
      console.log('Fetching images for encoded profile:', encodedProfileId);
      
      const res = await fetch(`/api/getImages?profile_id=${encodedProfileId}`);
      const data = await res.json();
      
      console.log('Received images data:', data);
      
      const imageArray = Array.isArray(data.images)
        ? data.images
        : Array.isArray(data)
        ? data
        : [];
      
      console.log('Processed image array:', imageArray);
      setImages(imageArray);
      setError(null);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Error fetching images');
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      if (profileId) {
        console.log('Loading images for profile:', profileId);
        await fetchImages();
        setIsInitialLoad(false);
      }
    };
    loadImages();
  }, [profileId]);

  // When actor profile becomes available, upload any pending images
  useEffect(() => {
    const uploadPendingImages = async () => {
      if (profileId && name && pendingImages.length > 0) {
        for (const file of pendingImages) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('profile_id', profileId);
          formData.append('name', name);
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || 'Upload failed');
            }
          } catch (err) {
            console.error('Error uploading pending image', err);
          }
        }
        setPendingImages([]);
        await fetchImages();
      }
    };
    uploadPendingImages();
  }, [profileId, name, pendingImages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      setError('No files selected');
      return;
    }
    const file = files[0];

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit');
      setSelectedFile(null);
      return;
    }

    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select an image file');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }

    // If actor data is not ready, store the image in pendingImages
    if (!profileId || !name) {
      setPendingImages((prev) => [...prev, selectedFile]);
      setSelectedFile(null);
      console.log('Profile not yet created. Image stored pending upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('profile_id', profileId);
    formData.append('name', name);

    try {
      console.log('Uploading image for profile:', profileId);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Upload response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      await fetchImages();
      setSelectedFile(null);
      // Reset file input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileUrl: string) => {
    // Only delete if actor info is present
    if (!fileUrl || !profileId || !name) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Deleting image:', fileUrl);
      const res = await fetch('/api/deleteImages', {
        method: 'POST',
        body: JSON.stringify({ 
          fileUrl, 
          profileId, 
          actorName: name.replace(/\s+/g, '')
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      console.log('Delete response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Delete failed');
      }
      
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Error deleting image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Inform the user that images will attach once profile data is available */}
      {(!profileId || !name) && (
        <div className="p-2 bg-yellow-100 text-yellow-800">
          Actor profile is not fully created. Uploaded images will be stored and attached once the profile is saved.
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*"
          className="border p-2 rounded w-full sm:w-auto"
          disabled={loading}
        />
        <button 
          onClick={handleUpload} 
          disabled={loading || !selectedFile}
          className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
            loading || !selectedFile ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {isInitialLoad ? (
        <div className="text-gray-500">Loading images...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length === 0 ? (
            <div className="text-gray-500">No images available</div>
          ) : (
            images.map((img: ImageData) => (
              <div key={img.file_url} className="relative group">
                <div className="aspect-square relative">
                  <Image 
                    src={img.file_url} 
                    alt="Actor Image" 
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <button
                  onClick={() => handleDelete(img.file_url)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UploadImage;
