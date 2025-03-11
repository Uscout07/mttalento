'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from './languageSwitches';
import { useLanguage } from './languageContext';
import { Icon } from '@iconify/react';

export default function Header() {
  const [isMounted, setIsMounted] = useState(false); // Ensure code runs only on the client
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const pathname = usePathname();

  useEffect(() => {
    // Set isMounted to true after component has mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Avoid running the effect before mounting

    const headerElement = document.querySelector('header');
    const blurgroundElement = document.querySelector('.blurground');
    const navElements = document.querySelectorAll('.navelement');
    if (headerElement) {
      if (pathname !== '/') {
        headerElement.classList.add('text-black');
        headerElement.classList.remove('text-white');
        headerElement.classList.remove('font-bold');
        headerElement.classList.add('sticky');
        headerElement.classList.remove('fixed');
      } else {
        headerElement.classList.remove('text-black');
        headerElement.classList.add('text-white');
        headerElement.classList.add('font-bold');
        headerElement.classList.remove('sticky');
        headerElement.classList.add('fixed');
      }
    }
    if (blurgroundElement) {
      if (pathname !== '/') {
        blurgroundElement.classList.add('hidden');
      } else {
        blurgroundElement.classList.remove('hidden');
      }
    }
    if (navElements) {
      navElements.forEach((element) => {
        if (pathname !== '/') {
          element.classList.add('hover:text-white');
        } else {
          element.classList.remove('hover:text-white');
        }
      });
    }
  }, [pathname, isMounted]); // Run only when pathname or isMounted changes

  const { language } = useLanguage();
  const Spanish = [
    { name: 'Inicio', link: '/' },
    { name: 'Actores', link: '/Actors' },
    { name: 'Actrices', link: '/Actresses' },
    { name: 'Actores Jóvenes', link: '/Young_Actors' },
    { name: 'Contáctanos', link: '/Contact' },
  ];
  const English = [
    { name: 'Home', link: '/' },
    { name: 'Actors', link: '/Actors' },
    { name: 'Actresses', link: '/Actresses' },
    { name: 'Young Actors', link: '/Young_Actors' },
    { name: 'Contact Us', link: '/Contact' },
  ];

  if (!isMounted) {
    return null; // Render nothing before the component has mounted
  }

  const navItems = language === 'es' ? Spanish : English;

  return (
    <header className="header w-full fixed text-white z-50 text-[2vh] font-bold">
      <div className="blurground w-[130vw] h-[15vh] -top-5 bg-[#000000d8] blur-[50px] absolute font-bold"></div>
      <div className="flex justify-between items-center p-5 relative z-10">
        {/* Logo */}
        <Link href="/">
          <img
            className="h-[6.27vh] drop-shadow-lg drop-shadow-white cursor-pointer"
            src="./logo.png"
            alt="logo"
          />
        </Link>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(true)} aria-label="Open Menu">
            <Icon icon="mdi:menu" className="text-red-500 text-3xl" />
          </button>
        </div>

        {/* Navigation Links for Desktop */}
        <nav className="hidden lg:flex items-center justify-between flex-1 ml-10">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="navelement p-[1vh] px-[1.5vh] hover:bg-red-700 transition-transform duration-300 ease-out hover:scale-110"
            >
              {item.name}
            </Link>
          ))}
          {/* Language Switcher with adjusted style */}
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
          <button
            className="absolute top-5 right-5"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close Menu"
          >
            <Icon icon="mdi:close" className="text-red-500 text-3xl" />
          </button>
          <nav className="flex flex-col items-center space-y-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="text-white text-2xl hover:text-red-500"
                onClick={() => setIsMenuOpen(false)} // Close menu when a link is clicked
              >
                {item.name}
              </Link>
            ))}
            {/* Language Switcher */}
            <div className="text-white">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
