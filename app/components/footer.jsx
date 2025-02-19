'use client';
import React from 'react';
import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white text-center py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-5">
        

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center space-x-6 text-xs">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/Actors" className="hover:text-gray-400">Actors</Link>
          <Link href="/Actresses" className="hover:text-gray-400">Actresses</Link>
          <Link href="/Young_Actors" className="hover:text-gray-400">Young Actors</Link>
          <Link href="/Contact" className="hover:text-gray-400">Contact Us</Link>
          <Link href="/Admin" className="text-red-400 hover:text-red-600">Admin</Link>
        </nav>

        {/* Credits & Copyright */}
        <div className="text-xs mt-4 md:mt-0">
          <p>© {new Date().getFullYear()} All Rights Reserved.</p>
          <p>Website by <Link  href="https://www.linkedin.com/in/udit-pant-20869318b/" target="_blank" className="text-blue-400 hover:underline">Parikalpana.io {`{Udit Pant}`}</Link></p>
        </div>

      </div>
    </footer>
  );
}
