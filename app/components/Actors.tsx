import React from 'react';
import Image from 'next/image';
import path from 'path';
import fs from 'fs/promises';

interface ActorsPageProps {
  params: { fileName: string };
}

export default function ActorsPage({ params }: ActorsPageProps) {
  const { fileName } = params;

  return (
    <div >
      <Image
        src={`/actors/${fileName}`}
        alt={`Image of ${fileName}`}
        width={350}
        height={527}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

export async function generateStaticParams() {
  const imagesDir = path.join(process.cwd(), 'public', 'actors');
  const fileNames = await fs.readdir(imagesDir);

  // Generate static params for all images
  return fileNames.map((fileName) => ({
    fileName,
  }));
}
