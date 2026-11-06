/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { YouthActivity } from '../../types';
import { Calendar, Clock, MapPin, Users, Tag, CheckCircle2 } from 'lucide-react';

export const ActividadesView: React.FC = () => {
  const [activities, setActivities] = useState<YouthActivity[]>([]);
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  useEffect(() => {
    api.getActivities().then(setActivities).catch(console.error);
  }, []);

  const handleRegister = (actId: string) => {
    setRegisteredId(actId);
    setTimeout(() => {
      alert('¡Inscripción registrada con éxito! El equipo del CMJ Flandes te enviará la confirmación a tu correo.');
    }, 200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Agenda Territorial
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Actividades y Encuentros Juveniles
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Calendario de foros de liderazgo, mesas veredales, torneos deportivos comunitarios y talleres de formación para las juventudes de Flandes.
        </p>
      </div>

      <div className="space-y-6">
        {activities.map(act => (
          <div
            key={act.id}
            className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row justify-between gap-6"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-900 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded">
                  {act.category}
                </span>
                <span className="text-xs text-stone-400">· Organiza: {act.organizer}</span>
              </div>

              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
                {act.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {act.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 dark:text-stone-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{act.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{act.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{act.location}</span>
                </div>
              </div>

              {act.requirements && (
                <p className="text-[11px] text-stone-500 italic">
                  Requisitos: {act.requirements}
                </p>
              )}
            </div>

            <div className="sm:text-right flex sm:flex-col justify-end shrink-0">
              {registeredId === act.id ? (
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Inscrito</span>
                </div>
              ) : (
                <button
                  onClick={() => handleRegister(act.id)}
                  disabled={!act.registrationOpen}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors disabled:opacity-50"
                >
                  {act.registrationOpen ? 'Inscribirme Gratis' : 'Cupos Cerrados'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
