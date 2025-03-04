'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Translations {
  name: string;
  dateOfBirth: string;
  selectAnActor: string;
  height: string;
  weight: string;
  skin: string;
  hair: string;
  eyes: string;
  nationality: string;
  immigrationStatus: string;
  profileNotFound: string;
  profileOf: string;
  demoReel: string;
  basicInfo: string;
  training: string;
  skills: string;
  documentarySeries: string;
  voiceDubbing: string;
  television: string;
  addLongFilmsCredits: string;
  addShortFilmsCredit: string;
  theatre: string;
  addTelevisionCredits: string;
  addTraining: string;
  addSkills: string;
  addDocumentarySeries: string;
  addVoiceDubbing: string;
  featureFilms: string;
  shortFilmsCredits: string;
  shortFilms: string;
  theater: string;
  voiceover: string;
  primaryImage: string;
  nationalityInfo: string;
  selectActor: string;
  longFilms: string;
  appearance: string;
  createNewActor: string;
  remove: string;
  cancel: string;
  confirm: string;
  actors: string;
  actresses: string;
  youngActors: string;
}

type LanguageType = 'en' | 'es';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  translations: Translations;
}

const translations: { [key in LanguageType]: Translations } = {
  en: {
    name: 'Name',
    selectAnActor: 'Select an Actor',
    basicInfo: 'Basic Information',
    dateOfBirth: 'Date of Birth',
    height: 'Height',
    weight: 'Weight',
    skin: 'Skin',
    hair: 'Hair',
    eyes: 'Eyes',
    nationality: 'Nationality',
    immigrationStatus: 'Immigration Status',
    profileNotFound: 'Profile Not Found',
    profileOf: 'Profile of',
    demoReel: 'Demo Reel',
    training: 'Training',
    skills: 'Skills',
    documentarySeries: 'Documentary Series',
    voiceDubbing: 'Voice Dubbing',
    television: 'Television',
    addLongFilmsCredits: 'Add Long Film Credits',
    addShortFilmsCredit: 'Add Short Films Credit',
    shortFilms: 'Short Films',
    theatre: 'Theatre',
    addTelevisionCredits: 'Add Television Credits',
    addTraining: 'Add Training',
    addSkills: 'Add Skills',
    addDocumentarySeries: 'Add Documentary Series',
    addVoiceDubbing: 'Add Voice Dubbing',
    featureFilms: 'Feature Films',
    shortFilmsCredits: 'Short Film Credits',
    theater: 'Theater',
    voiceover: 'Voice Over',
    primaryImage: 'Primary Image',
    nationalityInfo: 'Nationality Information',
    remove: 'Remove',
    selectActor: 'Select Actor',
    longFilms: 'Long Films',
    appearance: 'Appearance',
    createNewActor: 'Create New Actor',
    cancel: 'Cancel',
    actors: "Actors",
    actresses: "Actresses",
    confirm: "Confirm",
    youngActors: "Young Actors"
  },
  es: {
    name: 'Nombre',
    selectAnActor: 'Selecciona un Actor',
    basicInfo: 'Información Básica',
    dateOfBirth: 'Fecha de Nacimiento',
    height: 'Altura',
    weight: 'Peso',
    skin: 'Piel',
    hair: 'Cabello',
    eyes: 'Ojos',
    nationality: 'Nacionalidad',
    immigrationStatus: 'Estado Migratorio',
    profileNotFound: 'Perfil No Encontrado',
    profileOf: 'Perfil de',
    demoReel: 'Demo Reel',
    training: 'Formación',
    skills: 'Habilidades',
    documentarySeries: 'Serie Documental',
    voiceDubbing: 'Doblaje de Voz',
    television: 'Televisión',
    addLongFilmsCredits: 'Agregar créditos de largometrajes',
    shortFilms: 'Cortometrajes',
    shortFilmsCredits: 'Créditos de Cortometrajes',
    theatre: 'Teatro',
    addTelevisionCredits: 'Agregar Crédito De Televisión',
    addTraining: 'Agregar Formación',
    addSkills: 'Agregar Habilidades',
    addDocumentarySeries: 'Agregar Serie Documental',
    addVoiceDubbing: 'Agregar Doblaje de Voz',
    featureFilms: 'Largometrajes',
    addShortFilmsCredit: 'Agregar créditos de cortometrajes',
    longFilms: 'Largometrajes',
    theater: 'Teatro',
    voiceover: 'Doblaje de Voz',
    primaryImage: 'Imagen Principal',
    nationalityInfo: 'Información de Nacionalidad',
    remove: 'Eliminar',
    selectActor: 'Seleccionar Actor',
    createNewActor: 'Crear Nuevo Actor',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    appearance: 'Apariencia',
    actors: "Actores",
    actresses: "Actrices",
    youngActors: "Actores Jóvenes"
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  translations: translations.es,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('es');

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
