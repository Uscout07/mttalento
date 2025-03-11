'use client';
import { useState } from 'react';
import { Icon } from "@iconify/react";
import { useLanguage } from "../components/languageContext"; // Make sure the path is correct

export default function Contact() {
  const { translations } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Log the collected data
    console.log('Form Data:', formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Show success alert
    setShowAlert(true);
    
    // Hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black Gill_Sans">
      
      {/* Contact section */}
      <section className="w-full py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">{translations.contactUs.toUpperCase()}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Card */}
            <div className="lg:col-span-1 bg-gray-100 shadow-md rounded-lg p-6 h-fit">
              <h2 className="text-2xl font-semibold mb-6 text-red-600">{translations.getInTouch}</h2>
              
              {/* <div className="mb-8">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Icon icon="mdi:map-marker" className="text-red-600" />
                  {translations.address}
                </h3>
                <p className="text-gray-600">Mexico City, Mexico</p>
              </div> */}
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Icon icon="mdi:email" className="text-red-600" />
                  {translations.email}
                </h3>
                <p className="text-gray-600">contact@mttalento.com</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Icon icon="mdi:phone" className="text-red-600" />
                  {translations.phone}
                </h3>
                <p className="text-gray-600">+52 (123) 456-7890</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">{translations.socialMedia}</h3>
                <div className="flex items-center justify-start gap-4 mb-6">
                  <Icon icon="skill-icons:instagram" className="w-8 h-8" />
                  <Icon icon="devicon:facebook" className="text-[2.1rem]" />
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-gray-100 shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-red-600">{translations.sendMessage}</h2>
              
              {showAlert && (
                <div className="mb-6 bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{translations.messageSent}</span>
                  <button 
                    className="absolute top-0 bottom-0 right-0 px-4"
                    onClick={() => setShowAlert(false)}
                  >
                    &times;
                  </button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium">
                      {translations.yourName}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-3"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                      {translations.yourEmail}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-3"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                    {translations.subject}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-3"
                    placeholder={translations.howCanWeHelp}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    {translations.yourMessage}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-3"
                    placeholder={translations.typeYourMessage}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition duration-300 w-full md:w-auto"
                >
                  {translations.sendMessage}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}