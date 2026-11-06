/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { YouthProject } from '../../types';
import { Compass, Calendar, CheckCircle2, Circle, Users, DollarSign, MapPin, Layers } from 'lucide-react';

export const ProyectosView: React.FC = () => {
  const [projects, setProjects] = useState<YouthProject[]>([]);
  const [filter, setFilter] = useState<string>('Todos');

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  const statuses = ['Todos', 'Formulación', 'Radicado en Alcaldía', 'En Ejecución', 'Culminado'];

  const filteredProjects = projects.filter(p => {
    if (filter === 'Todos') return true;
    return p.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Iniciativas y Políticas Públicas
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Banco de Proyectos Juveniles de Flandes
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Espacio de formulación, concertación y seguimiento a proyectos de desarrollo social, cultural, ambiental y económico para la juventud flamenca.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === st
                ? 'bg-red-900 text-white font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-8">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-red-900 dark:text-red-400">
                  {project.code}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  {project.commissionName}
                </span>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 w-fit">
                {project.status}
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {project.objective}
              </p>
            </div>

            {/* Justification Box */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 text-xs text-stone-600 dark:text-stone-300 space-y-1">
              <strong className="text-stone-900 dark:text-white block font-sans">
                Justificación y Diagnóstico Territorial:
              </strong>
              <p className="leading-relaxed">{project.justification}</p>
            </div>

            {/* Metadata Badges Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 dark:text-stone-300 pt-1">
              <div className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                <Users className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase">Beneficiarios</span>
                  <span className="font-medium">{project.beneficiaries}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase">Zona de Impacto</span>
                  <span className="font-medium">{project.impactZone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-lg">
                <DollarSign className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase">Presupuesto Estimado</span>
                  <span className="font-medium">{project.budgetEstimate}</span>
                </div>
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
                <span>Porcentaje de avance en gestión institucional:</span>
                <span className="font-mono font-bold text-red-900 dark:text-red-400">
                  {project.progressPercentage}%
                </span>
              </div>
              <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-900 dark:bg-red-500 rounded-full transition-all"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Milestones Tracker */}
            {project.milestones && project.milestones.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Hitos y Cronograma de Cumplimiento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {project.milestones.map((ms, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                        ms.completed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-300'
                          : 'bg-stone-50 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {ms.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-medium block">{ms.title}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{ms.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
