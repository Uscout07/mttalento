'use client';
import { useState, useEffect } from "react";

interface PosterCarouselProps {
  images: string[];
}

const PosterCarousel: React.FC<PosterCarouselProps> = ({ images }) => {
  // Default to 3 images on larger screens.
  const [numImages, setNumImages] = useState(3);
  // Set the initial indices based on numImages.
  const [currentIndices, setCurrentIndices] = useState<number[]>(() =>
    Array.from({ length: numImages }, (_, i) => i)
  );
  const [fade, setFade] = useState(false);

  // Update number of displayed images based on window width.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setNumImages(1);
      } else if (window.innerWidth < 768) {
        setNumImages(2);
      } else {
        setNumImages(3);
      }
    }
    // Run on mount.
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Whenever numImages changes, update the current indices.
  useEffect(() => {
    setCurrentIndices(Array.from({ length: numImages }, (_, i) => i));
  }, [numImages]);

  // Carousel effect: update images every 7 seconds with a fade transition.
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndices((prev) =>
          prev.map((index) => (index + numImages) % images.length)
        );
        setFade(false);
      }, 500); // Match with your CSS fade transition duration.
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length, numImages]);

  return (
    <div className="relative w-full h-screen flex overflow-hidden -z-10">
      {currentIndices.map((index, i) => (
        <div
          key={i}
          className={`absolute top-0 h-full transition-opacity duration-1000 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
          style={{
            left: `${(i * 100) / numImages}%`,
            width: `${100 / numImages}%`,
          }}
        >
          <img
            src={images[index]}
            alt={`Poster ${index + 1}`}
            className="object-cover w-full h-full grayscale darken brightness-50"
          />
        </div>
      ))}
    </div>
  );
};

export default PosterCarousel;
