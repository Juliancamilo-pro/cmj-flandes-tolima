/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CouncilSession } from '../../types';
import { Calendar, Clock, MapPin, Users, Download, ExternalLink, CalendarPlus, FileCheck } from 'lucide-react';

export const SesionesView: React.FC = () => {
  const [sessions, setSessions] = useState<CouncilSession[]>([]);
  const [filter, setFilter] = useState<'Todas' | 'Programada' | 'Realizada'>('Todas');

  useEffect(() => {
    api.getSessions().then(setSessions).catch(console.error);
  }, []);

  const filteredSessions = sessions.filter(s => {
    if (filter === 'Todas') return true;
    return s.status === filter;
  });

  const getGoogleCalendarUrl = (session: CouncilSession) => {
    const title = encodeURIComponent(`CMJ Flandes: ${session.title}`);
    const details = encodeURIComponent(
      `Convocatoria Oficial CMJ Flandes (Tolima)\nTipo: Sesión ${session.type}\nLugar: ${session.location}\n\nOrden del día:\n${(session.orderOfDay || []).join('\n')}`
    );
    const location = encodeURIComponent(session.location || 'Palacio Municipal de Flandes, Tolima');
    // Format YYYYMMDD
    const dateFormatted = session.date.replace(/-/g, '');
    const dates = `${dateFormatted}T150000Z/${dateFormatted}T180000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Actividad Plenaria y Convocatorias
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Sesiones del Consejo Municipal de Juventud
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Convocatorias formales, calendario de reuniones plenarias ordinarias y extraordinarias, órdenes del día y verificación del quórum reglamentario en Flandes, Tolima. Integrado con Google Calendar.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['Todas', 'Programada', 'Realizada'] as const).map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === st
                ? 'bg-red-900 text-white font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {st === 'Todas' ? 'Todas las Sesiones' : `${st}s`}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="p-10 text-center rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
          <Calendar className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
            Convocatorias Oficiales en Espera
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            La Secretaría General y la Mesa Directiva publicarán oportunamente las citaciones oficiales y órdenes del día de las plenarias ordinarias y extraordinarias conforme al reglamento interno.
          </p>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-6">
        {filteredSessions.map(session => (
          <div
            key={session.id}
            className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-red-900 dark:text-red-400">
                  {session.sessionNumber}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-xs text-stone-500 font-medium">Sesión {session.type}</span>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit ${
                  session.status === 'Programada'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {session.status}
              </span>
            </div>

            <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-white">
              {session.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Fecha: <strong>{session.date}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Hora: <strong>{session.time}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate" title={session.location}>{session.location}</span>
              </div>
            </div>

            {/* Google Calendar Sync Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={getGoogleCalendarUrl(session)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900 flex items-center gap-1.5 transition-colors"
                title="Añadir recordatorio en Google Calendar"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-red-600" />
                <span>Sincronizar con Google Calendar</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <button
                onClick={() => api.downloadSessionIcs(session.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1.5 transition-colors"
                title="Descargar archivo iCalendar .ics"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Descargar .ics</span>
              </button>
            </div>

            {/* Quorum Info */}
            <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Quórum reglamentario requerido: <strong>{session.quorumRequired} consejeros</strong></span>
              </div>
              {session.quorumConfirmed !== undefined && (
                <span>· Quórum verificado: <strong>{session.quorumConfirmed} consejeros</strong></span>
              )}
            </div>

            {/* Orden del día */}
            {session.orderOfDay && session.orderOfDay.length > 0 && (
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Orden del Día Aprobado
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600 dark:text-stone-300">
                  {session.orderOfDay.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Summary Results if Realizada */}
            {session.summaryResults && (
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200">
                <strong className="block font-semibold mb-1">Decisiones y Resultados de la Plenaria:</strong>
                <p className="leading-relaxed">{session.summaryResults}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
