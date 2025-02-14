// components/uploadImages.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageData {
    file_url: string;
}

interface UploadImageProps {
    profileId: string;
    name: string;
}

const UploadImage = ({ profileId, name }: UploadImageProps) => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profileId) {
            fetchImages();
        }
    }, [profileId]);

    const fetchImages = async () => {
        try {
            // Encode the profile_id to handle special characters
            const encodedProfileId = encodeURIComponent(profileId);
            const res = await fetch(`/api/getImages?profile_id=${encodedProfileId}`);
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch images');
            }
            
            const data = await res.json();
            setImages(data.images || []);
            setError(null);
        } catch (error) {
            setError('Error fetching images');
            console.error('Error fetching images:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            setError('No files selected');
            return;
        }
        const file = files[0];
        
        // Validate file size (e.g., 5MB limit)
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
        if (!selectedFile || !name || !profileId) {
            setError('Missing required information');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('profile_id', profileId);
        formData.append('name', name);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            
            await fetchImages();
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            setError('Error uploading file');
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileUrl: string) => {
        if (!fileUrl || !profileId || !name) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/deleteImages', {
                method: 'POST',
                body: JSON.stringify({ 
                    fileUrl, 
                    profileId, 
                    actorName: name.replace(/\s+/g, '')
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Delete failed');
            }
            
            await fetchImages();
        } catch (error) {
            setError('Error deleting image');
            console.error('Error deleting image:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!profileId || !name) {
        return <div className="p-4 text-red-500">Profile ID and name are required</div>;
    }

    return (
        <div className="p-4 space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img: ImageData) => (
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
                ))}
            </div>
        </div>
    );
};

export default UploadImage;