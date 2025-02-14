'use client';
import { useState, useEffect } from "react";

interface PosterCarouselProps {
  images: string[];
}

const PosterCarousel: React.FC<PosterCarouselProps> = ({ images }) => {
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]); // Indices for the three displayed images
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Trigger fade-out effect
      setTimeout(() => {
        // Update the indices after fade-out
        setCurrentIndices((prev) => {
          return prev.map((index) => (index + 3) % images.length); // Skip ahead by 3 for new images
        });
        setFade(false); // Trigger fade-in effect
      }, 500); // Match this to the CSS transition duration for smooth fade-out
    }, 7000); // Change images every 7 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-screen flex overflow-hidden -z-10">
      {currentIndices.map((index, i) => (
        <div
          key={i}
          className={`absolute top-0 ${
            i === 0 ? "left-0" : i === 1 ? "left-1/3" : "left-2/3"
          } w-1/3 h-full transition-opacity duration-1000 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={images[index]}
            alt={`Poster ${index + 1}`}
            className="object-cover w-full h-full grayscale brightness-50"
          />
        </div>
      ))}
    </div>
  );
};

export default PosterCarousel;
