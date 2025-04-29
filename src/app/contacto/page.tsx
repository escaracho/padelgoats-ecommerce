'use client';

import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Contacto</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Contact Information */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Información de Contacto</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaPhone className="mt-1 text-primary" />
              <div>
                <h3 className="font-semibold">Teléfono</h3>
                <p className="text-gray-600">+34 123 456 789</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <FaEnvelope className="mt-1 text-primary" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">info@padelgoats.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="mt-1 text-primary" />
              <div>
                <h3 className="font-semibold">Dirección</h3>
                <p className="text-gray-600">
                  Calle Pádel, 123<br />
                  28001 Madrid, España
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <FaClock className="mt-1 text-primary" />
              <div>
                <h3 className="font-semibold">Horario</h3>
                <p className="text-gray-600">
                  Lunes - Viernes: 9:00 - 20:00<br />
                  Sábado: 10:00 - 14:00<br />
                  Domingo: Cerrado
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Envíanos un Mensaje</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block font-semibold">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="mb-1 block font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="mb-1 block font-semibold">
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="mb-1 block font-semibold">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-secondary"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 