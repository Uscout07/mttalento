import Header from "./components/header";
import PosterCarousel from "./components/PosterCarousel";
import { Icon } from "@iconify/react";

export default function Home() {
  const posters = [
    "/posters/poster1.jpeg",
    "/posters/poster2.jpeg",
    "/posters/poster3.jpeg",
    "/posters/poster4.jpeg",
    "/posters/poster5.jpeg",
    "/posters/poster6.jpeg",
    "/posters/poster7.jpeg",
    "/posters/poster8.jpeg",
  ];
  return (
    <div className="relative w-full h-screen overflow-hidden ">
      <PosterCarousel images={posters} />
      <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10 Gill_Sans">
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-4xl  mb-4">MT' TALENTO</h1>
          <p className="text-lg mb-6">Made in 🇲🇽 🇺🇸</p>
          <div className='flex items-center justify-center gap-[0.5vh]'>
            <Icon icon="skill-icons:instagram" width="3.2vh" height="3.2vh" />
            <Icon icon="devicon:facebook" width="3.2vh" height="3.2vh" />
          </div>
          <button className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition">
            CONTÁCTANOS
          </button>

        </div>
      </div>
    </div>
  );
}
