// components/uploadImages.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const UploadImage = ({ profileId, name }) => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (profileId) {
            fetchImages();
        }
    }, [profileId]);

    const fetchImages = async () => {
        try {
            const res = await fetch(`/api/getImages?profile_id=${profileId}`);
            if (!res.ok) throw new Error('Failed to fetch images');
            const data = await res.json();
            setImages(data.images || []);
            setError(null);
        } catch (error) {
            setError('Error fetching images');
            console.error('Error fetching images:', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
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

            if (!res.ok) throw new Error('Upload failed');
            
            await fetchImages();
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            setError('Error uploading file');
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileUrl) => {
        if (!fileUrl || !profileId || !name) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/deleteImages', {
                method: 'POST',
                body: JSON.stringify({ fileUrl, profileId, actorName: name.replace(/\s+/g, '') }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error('Delete failed');
            
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
            <div className="flex items-center space-x-4">
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept="image/*"
                    className="border p-2 rounded"
                    disabled={loading}
                />
                <button 
                    onClick={handleUpload} 
                    disabled={loading || !selectedFile}
                    className={`px-4 py-2 rounded text-white ${loading || !selectedFile ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {error && (
                <div className="text-red-500 p-2 bg-red-50 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img) => (
                    <div key={img.file_url} className="relative group">
                        <Image 
                            src={img.file_url} 
                            alt="Actor Image" 
                            width={128}
                            height={128}
                            className="w-32 h-32 object-cover rounded"
                        />
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