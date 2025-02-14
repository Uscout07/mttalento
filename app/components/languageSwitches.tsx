// LanguageSwitcher.tsx
'use client';
import { useLanguage } from "./languageContext";
import { Icon } from '@iconify/react/dist/iconify.js';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <button onClick={toggleLanguage}>
      {language === "en" ? (
        <div className="flex gap-[1vh] items-center hover:scale-110 p-[1vh] px-[1.5vh] hover:bg-red-700 hover:text-white transition-transform duration-300 ease-out">
          <Icon className="text-[3vh]" icon="emojione-v1:flag-for-mexico" />
          Switch to Spanish
        </div>
      ) : (
        <div className="flex gap-[1vh] items-center hover:scale-110 p-2 hover:bg-red-700 hover:text-white transition-all duration-300 ease-out">
          <Icon className="text-[3vh]" icon="emojione-v1:flag-for-united-states" />
          Cambiar a Inglés
        </div>
      )}
    </button>
  );
};

export default LanguageSwitcher;