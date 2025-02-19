import PosterCarousel from "./components/PosterCarousel";
import { Icon } from "@iconify/react";

export default function Home() {
  const posters = [
    "/posters/poster1.jpg",
    "/posters/poster2.jpg",
    "/posters/poster3.jpg",
    "/posters/poster4.jpg",
    "/posters/poster5.jpg",
    "/posters/poster6.jpg",
    "/posters/poster7.jpg",
    "/posters/poster8.jpg",
  ];
  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Background carousel */}
      <PosterCarousel images={posters} />

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 px-4 Gill_Sans">
        <div className="w-[110%] h-[50%] bg-black blur-3xl opacity-60 absolute -z-10" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">MT TALENTO</h1>
        
        {/* Replaced emojis with flag icons */}
        <p className="text-lg md:text-xl mb-6 flex items-center gap-2">
          Made in 
          <Icon icon="twemoji:flag-mexico" className="w-6 h-6" />
          <Icon icon="twemoji:flag-united-states" className="w-6 h-6" />
        </p>
        
        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Icon icon="skill-icons:instagram" className="w-8 h-8" />
          <Icon icon="devicon:facebook" className="w-8 h-8" />
        </div>
        
        {/* Call-to-action button */}
        <button className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition duration-300">
          CONTÁCTANOS
        </button>
      </div>
    </div>
  );
}
