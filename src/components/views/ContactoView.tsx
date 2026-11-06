/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { FlandesTerritorialMap } from '../maps/FlandesTerritorialMap';
import { api } from '../../services/api';

export const ContactoView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gmailDirectUrl, setGmailDirectUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.sendGmailNotification({
        subject,
        message,
        senderName: name,
        senderEmail: email,
        phone,
      });

      setGmailDirectUrl(res.webGmailUrl);
      setSubmitted(true);
    } catch (err) {
      // Fallback: direct web Gmail link
      const encodedSubj = encodeURIComponent(`[CMJ FLANDES] ${subject}`);
      const encodedBody = encodeURIComponent(
        `De: ${name} (${email})\nTeléfono: ${phone}\n\nMensaje:\n${message}\n\n---\nEnviado a la Secretaría General del CMJ Flandes`
      );
      setGmailDirectUrl(`https://mail.google.com/mail/?view=cm&fs=1&to=trujillogordilooo@gmail.com&su=${encodedSubj}&body=${encodedBody}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Canales de Atención Ciudadana e Institucional
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Contacto Institucional CMJ Flandes
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Comunícate directamente con la Secretaría General del Consejo Municipal de Juventud de Flandes (Tolima) o visítanos en la sede institucional del Palacio Municipal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Info Column: 5 Cols */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
              Secretaría General y Sede
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-900 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">Palacio Municipal de Flandes</strong>
                  <span>Carrera 8 con Calle 9, Frente al Parque Principal</span>
                  <span className="block text-stone-400 text-xs">Flandes, Tolima, Colombia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">Correo Oficial de la Secretaría</strong>
                  <a
                    href="mailto:trujillogordilooo@gmail.com"
                    className="font-medium text-red-900 dark:text-red-400 hover:underline break-all"
                  >
                    trujillogordilooo@gmail.com
                  </a>
                  <span className="block text-[11px] text-stone-500">Atención oficial Mesa Directiva</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">Línea de Juventudes</strong>
                  <span>+57 (8) 248 0000 / Ext. Juventudes</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">Horario de Atención al Ciudadano</strong>
                  <span>Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Gmail Direct Button */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=trujillogordilooo@gmail.com&su=%5BCMJ%20FLANDES%5D%20Contacto%20Oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-300 border border-red-200 dark:border-red-900 hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-red-600" />
                <span>Escribir directamente desde Gmail</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form Column: 7 Cols */}
        <div className="md:col-span-7 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-serif font-bold text-xl text-emerald-950 dark:text-emerald-100">
                ¡Mensaje Registrado con Éxito!
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Tu comunicación fue recibida para el despacho de la Secretaría General del CMJ Flandes (<span className="font-semibold">trujillogordilooo@gmail.com</span>).
              </p>

              {gmailDirectUrl && (
                <div className="pt-2">
                  <a
                    href={gmailDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-900 hover:bg-red-950 rounded-lg shadow-sm transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Abrir y Enviar en Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <button
                onClick={() => setSubmitted(false)}
                className="block mx-auto text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline pt-2"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white mb-2">
                Envíanos una Comunicación Oficial
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Ej. Solicitud a la Secretaría General"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="300 123 4567"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje institucional aquí..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enviando correspondencia...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar a Secretaría General (Gmail)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Interactive Territorial Map of Flandes */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
        <FlandesTerritorialMap />
      </div>
    </div>
  );
};
