/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { YouthProject, CouncilSession, DocumentItem } from '../../types';
import { CheckCircle2, TrendingUp, Calendar, FileText, Compass, Award, ExternalLink } from 'lucide-react';

interface GestionViewProps {
  onNavigate: (view: string) => void;
}

export const GestionView: React.FC<GestionViewProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<YouthProject[]>([]);
  const [sessions, setSessions] = useState<CouncilSession[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    Promise.all([api.getProjects(), api.getSessions(), api.getDocuments()]).then(([p, s, d]) => {
      setProjects(p);
      setSessions(s);
      setDocuments(d);
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Resultados y Rendición de Cuentas
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Gestión del Consejo de Juventud
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Balance de actividades, proposiciones aprobadas, control social ejercido e iniciativas formuladas en favor de las juventudes de Flandes.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400">Proyectos Activos</div>
          <div className="text-3xl font-bold font-sans text-red-900 dark:text-red-400 mt-1 tabular-nums">
            {projects.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">En formulación y ejecución</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400">Plenarias Realizadas</div>
          <div className="text-3xl font-bold font-sans text-amber-800 dark:text-amber-400 mt-1 tabular-nums">
            {sessions.filter(s => s.status === 'Realizada').length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Ordinarias y extraordinarias</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400">Actas y Resoluciones</div>
          <div className="text-3xl font-bold font-sans text-emerald-800 dark:text-emerald-400 mt-1 tabular-nums">
            {documents.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Custodia pública abierta</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-xs text-stone-500 dark:text-stone-400">Comisiones Temáticas</div>
          <div className="text-3xl font-bold font-sans text-blue-900 dark:text-blue-400 mt-1 tabular-nums">
            5
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Mesas técnicas activas</div>
        </div>
      </div>

      {/* Proyectos Destacados en Gestión */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
            Avances en Iniciativas y Proyectos Clave
          </h2>
          <button
            onClick={() => onNavigate('proyectos')}
            className="text-xs font-semibold text-red-900 dark:text-red-400 hover:underline"
          >
            Ver banco de proyectos completo
          </button>
        </div>

        <div className="space-y-4">
          {projects.map(proj => (
            <div
              key={proj.id}
              className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-bold text-stone-400 mr-2">{proj.code}</span>
                  <span className="text-xs font-semibold text-red-900 dark:text-red-400">{proj.commissionName}</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 w-fit">
                  {proj.status}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                {proj.title}
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {proj.objective}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Avance de concertación y gestión:</span>
                  <span className="font-mono font-bold">{proj.progressPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-900 dark:bg-red-500 rounded-full transition-all"
                    style={{ width: `${proj.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
