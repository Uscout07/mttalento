'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center  bg-white text-white text-center px-6 h-screen">

      {/* Glitch Effect */}
      <h1 className="mt-4 text-7xl font-bold text-red-500 relative glitch">
        404
      </h1>

      {/* Movie-Themed Message */}
      <p className="mt-2 text-xl text-gray-400">
        Oops! This scene doesn't exist. Maybe the reel got lost?
      </p>

      {/* Back to Home Button */}
      <Link href="/">
        <button className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition">
          Back to Home
        </button>
      </Link>

      {/* Styling for Glitch Effect */}
      <style jsx>{`
        .glitch {
          position: relative;
          display: inline-block;
          animation: glitch 1s infinite linear alternate;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 2px 0 #ff0000, -2px -2px 0 #0000ff; }
          50% { text-shadow: -2px -2px 0 #ff0000, 2px 2px 0 #0000ff; }
          100% { text-shadow: 2px -2px 0 #ff0000, -2px 2px 0 #0000ff; }
        }
      `}</style>
    </div>
  );
}
