/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Commission } from '../../types';
import { Shield, Clock, Users, Target, CheckCircle } from 'lucide-react';

export const ComisionesView: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    api.getCommissions().then(setCommissions).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Estructura de Trabajo Temático
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Comisiones de Trabajo del CMJ Flandes
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Mesas técnicas permanentes donde los consejeros analizan problemáticas específicas, redactan proyectos de acuerdo y articulan propuestas sectoriales.
        </p>
      </div>

      <div className="space-y-8">
        {commissions.map(com => (
          <div
            key={com.id}
            className="p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-red-900 dark:text-red-400 font-sans">
                Comisión Permanente
              </span>
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{com.membersCount} Consejeros asignados</span>
                </div>
                <span>·</span>
                <span>{com.activeProjectsCount} Proyectos en curso</span>
              </div>
            </div>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-white">
              {com.name}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {com.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Horario de reunión periódica: <strong>{com.meetingSchedule}</strong></span>
            </div>

            {com.strategicObjectives && com.strategicObjectives.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Objetivos Estratégicos Prioritarios
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  {com.strategicObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-red-900 dark:text-red-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
