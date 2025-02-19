'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage, LanguageProvider } from './languageContext';

interface ActorFormProps {
  actor: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  isNew: boolean;
}

const ActorForm: React.FC<ActorFormProps> = ({ actor = {}, onSubmit, isLoading, isNew }) => {
  const { translations } = useLanguage();

  const parseAppearance = (appearanceData: any) => {
    return {
      en: {
        eyes: appearanceData?.en?.eyes ?? '',
        hair: appearanceData?.en?.hair ?? '',
        skin: appearanceData?.en?.skin ?? '',
      },
      es: {
        ojos: appearanceData?.es?.ojos ?? '',
        piel: appearanceData?.es?.piel ?? '',
        cabello: appearanceData?.es?.cabello ?? '',
      },
    };
  };

  const initialFormData = {
    id: actor?.id ?? '',
    name: actor?.name ?? '',
    birth_date: actor?.birth_date ?? '',
    height: actor?.height ?? '',
    weight: actor?.weight ?? '',
    appearance: parseAppearance(actor?.appearance),
    nationality: {
      en: actor?.nationality?.en ?? '',
      es: actor?.nationality?.es ?? '',
    },
    primary_image: actor?.primary_image ?? '',
    television: actor?.television ?? [],
    largometrajes: actor?.largometrajes ?? [],
    cortometrajes: actor?.cortometrajes ?? [],
    teatro: actor?.teatro ?? [],
    formacion: actor?.formacion ?? [],
    habilidades: actor?.habilidades ?? [],
    serie_documental: actor?.serie_documental ?? [],
    doblaje_voz: actor?.doblaje_voz ?? [],
  };

  const [formData, setFormData] = useState<{ [key: string]: any }>(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
  }, [actor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocalizedChange = (
    field: string,
    lang: string,
    subfield: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: {
          ...prev[field][lang],
          [subfield]: value,
        },
      },
    }));
  };

  const handleArrayChange = (
    field: keyof typeof formData,
    index: number,
    key: string,
    value: any
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] || [])] as any[];
      if (!newArray[index]) {
        newArray[index] = {};
      }
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const addToArray = (field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), {}],
    }));
  };

  const removeFromArray = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || [])?.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <form onSubmit={handleSubmit}>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">{translations?.basicInfo || 'Basic Information'}</h2>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {translations?.name || 'Name'}
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded border border-gray-300 p-2"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {translations?.dateOfBirth}
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded border border-gray-300 p-2"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {translations?.height || 'Height'}
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    className="mt-1 block w-full rounded border border-gray-300 p-2"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {translations?.weight || 'Weight'}
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded border border-gray-300 p-2"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations?.appearance || 'Appearance'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* English Appearance */}
                            <div className="space-y-2">
                                <h4 className="font-medium">English</h4>
                                <input
                                    type="text"
                                    placeholder="Eyes"
                                    value={formData.appearance.en.eyes}
                                    onChange={(e) => handleLocalizedChange('appearance', 'en', 'eyes', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Hair"
                                    value={formData.appearance.en.hair}
                                    onChange={(e) => handleLocalizedChange('appearance', 'en', 'hair', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Skin"
                                    value={formData.appearance.en.skin}
                                    onChange={(e) => handleLocalizedChange('appearance', 'en', 'skin', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                            </div>

                            {/* Spanish Appearance */}
                            <div className="space-y-2">
                                <h4 className="font-medium">Español</h4>
                                <input
                                    type="text"
                                    placeholder="Ojos"
                                    value={formData.appearance.es.ojos}
                                    onChange={(e) => handleLocalizedChange('appearance', 'es', 'ojos', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Cabello"
                                    value={formData.appearance.es.cabello}
                                    onChange={(e) => handleLocalizedChange('appearance', 'es', 'cabello', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Piel"
                                    value={formData.appearance.es.piel}
                                    onChange={(e) => handleLocalizedChange('appearance', 'es', 'piel', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nationality Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations?.nationality || 'Nationality'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    English
                                    <input
                                        type="text"
                                        placeholder="Nationality"
                                        value={formData.nationality.en}
                                        onChange={(e) => handleLocalizedChange('nationality', 'en', 'nationality', e.target.value)}
                                        className="block w-full rounded border border-gray-300 p-2"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Español
                                    <input
                                        type="text"
                                        placeholder="Nacionalidad"
                                        value={formData.nationality.es}
                                        onChange={(e) => handleLocalizedChange('nationality', 'es', 'nationality', e.target.value)}
                                        className="block w-full rounded border border-gray-300 p-2"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Primary Image */}
                    {formData.primary_image && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">{translations?.primaryImage || 'Primary Image'}</h3>
                            <div className="flex justify-center">
                                <img src={formData.primary_image} alt="Primary" className="w-32 h-32 object-cover rounded" />
                            </div>
                        </div>
                    )}

                    {/* Television Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations?.television || 'Television'}</h3>
                        {formData.television.map((show: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={show.role || ''}
                                    onChange={(e) => handleArrayChange('television', index, 'role', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={show.title || ''}
                                    onChange={(e) => handleArrayChange('television', index, 'title', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={show.year || ''}
                                    onChange={(e) => handleArrayChange('television', index, 'year', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />

                                <input
                                    type="text"
                                    placeholder="Network"
                                    value={show.network || ''}
                                    onChange={(e) => handleArrayChange('television', index, 'network', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('television', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove || 'Remove'}
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('television')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addTelevisionCredits || 'Add Television Credit'}
                        </button>
                    </div>

                    {/* Long Films Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations?.longFilms || 'Long Films'}</h3>
                        {formData.largometrajes.map((film: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={film.role || ''}
                                    onChange={(e) => handleArrayChange('largometrajes', index, 'role', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={film.title || ''}
                                    onChange={(e) => handleArrayChange('largometrajes', index, 'title', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={film.year || ''}
                                    onChange={(e) => handleArrayChange('largometrajes', index, 'year', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Director"
                                    value={film.director || ''}
                                    onChange={(e) => handleArrayChange('largometrajes', index, 'director', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('largometrajes', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove || 'Remove'}
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('largometrajes')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addLongFilmsCredits || 'Add Long Film Credit'}
                        </button>
                    </div>

                    {/* Short Films Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations?.shortFilms || 'Short Films'}</h3>
                        {formData.cortometrajes.map((film: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={film.role || ''}
                                    onChange={(e) => handleArrayChange('cortometrajes', index, 'role', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={film.title || ''}
                                    onChange={(e) => handleArrayChange('cortometrajes', index, 'title', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={film.year || ''}
                                    onChange={(e) => handleArrayChange('cortometrajes', index, 'year', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Director"
                                    value={film.director || ''}
                                    onChange={(e) => handleArrayChange('cortometrajes', index, 'director', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('cortometrajes', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove || 'Remove'}
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('cortometrajes')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addShortFilmsCredit || 'Add Short Film Credit'}
                        </button>
                    </div>

                    {/* Theatre Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations.theatre}</h3>
                        {formData.teatro.map((play: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={play.role || ''}
                                    onChange={(e) => handleArrayChange('teatro', index, 'role', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={play.title || ''}
                                    onChange={(e) => handleArrayChange('teatro', index, 'title', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={play.year || ''}
                                    onChange={(e) => handleArrayChange('teatro', index, 'year', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Venue"
                                    value={play.venue || ''}
                                    onChange={(e) => handleArrayChange('teatro', index, 'venue', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Director"
                                    value={play.director || ''}
                                    onChange={(e) => handleArrayChange('teatro', index, 'director', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Producer"
                                    value={play.producer || ''}
                                    onChange={(e) => handleArrayChange('teatro', index, 'producer', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('teatro', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove}                            </button>
                            </div>

                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('teatro')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addTelevisionCredits || 'Add Theatre Credit'}
                        </button>
                    </div>

                    {/* Training Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations.training}</h3>
                        {(formData.formacion || []).map((training: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={training.year || ''}
                                    onChange={(e) => handleArrayChange('formacion', index, 'year', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={training.description || ''}
                                    onChange={(e) => handleArrayChange('formacion', index, 'description', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('formacion', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove}                            </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('formacion')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addTraining || 'Add Training'}
                        </button>
                    </div>

                    {/* Skills (Habilidades) Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations.skills}</h3>
                        {(formData.habilidades || []).map((skill: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={skill.category || ''}
                                    onChange={(e) => handleArrayChange('habilidades', index, 'category', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Skills"
                                    value={(skill.skills || []).join(', ')}
                                    onChange={(e) => handleArrayChange('habilidades', index, 'skills', e.target.value.split(', '))}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('habilidades', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove}                            </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('habilidades')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addSkills || 'Add Skill'}
                        </button>
                    </div>
                    {/* Documentary Series Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations.documentarySeries}</h3>
                        {(formData.serie_documental || []).map((series: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={series.title || ''}
                                    onChange={(e) => handleArrayChange('serie_documental', index, 'title', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={series.year || ''}
                                    onChange={(e) => handleArrayChange('serie_documental', index, 'year', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Network"
                                    value={series.network || ''}
                                    onChange={(e) => handleArrayChange('serie_documental', index, 'network', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('serie_documental', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove}                            </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('serie_documental')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addDocumentarySeries || 'Add Documentary Series'}
                        </button>
                    </div>

                    {/* Voice Dubbing Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">{translations.voiceDubbing}</h3>
                        {(formData.doblaje_voz || []).map((dubbing: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                                <input
                                    type="text"
                                    placeholder="Character"
                                    value={dubbing.character || ''}
                                    onChange={(e) => handleArrayChange('doblaje_voz', index, 'character', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Movie/Series"
                                    value={dubbing.show || ''}
                                    onChange={(e) => handleArrayChange('doblaje_voz', index, 'show', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={dubbing.year || ''}
                                    onChange={(e) => handleArrayChange('doblaje_voz', index, 'year', e.target.value)}
                                    className="block w-full rounded border border-gray-300 p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFromArray('doblaje_voz', index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {translations?.remove}                            </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addToArray('doblaje_voz')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {translations?.addVoiceDubbing || 'Add Voice Dubbing'}
                        </button>
                    </div>

                </div>
                <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            {isNew ? translations?.createNewActor || 'Create Actor' : translations?.confirm || 'Confirm'}
                        </button>
                    </div>
            </form>
        </div>

    );

};

export default function App() {
    return (
        <LanguageProvider>
            <ActorForm actor={{}} onSubmit={() => {}} isLoading={false} isNew={true} />
        </LanguageProvider>
    );
}
