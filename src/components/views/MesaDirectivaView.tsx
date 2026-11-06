/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ConsejeroProfile } from '../../types';
import { Award, Shield, CheckCircle, Mail, Phone, BookOpen } from 'lucide-react';

export const MesaDirectivaView: React.FC = () => {
  const [mesaConsejeros, setMesaConsejeros] = useState<ConsejeroProfile[]>([]);

  useEffect(() => {
    api.getConsejeros().then(data => {
      setMesaConsejeros(data.filter(c => c.isMesaDirectiva));
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Órgano de Dirección y Coordinación
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Mesa Directiva del CMJ Flandes
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Integrada por el Presidente, Vicepresidente y Secretario General, elegidos en plenaria para liderar la representación institucional, la gestión de sesiones y la custodia documental.
        </p>
      </div>

      {/* Cards of the 3 Leadership Positions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mesaConsejeros.map(member => (
          <div
            key={member.id}
            className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded">
                  {member.mesaDirectivaPosition || member.roleTitle}
                </span>
                <span className="text-xs text-stone-400 font-mono">{member.period}</span>
              </div>

              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-red-900 dark:text-red-400 mb-3">
                {member.partyOrOrgName}
              </p>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                {member.bio}
              </p>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{member.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Normative Mandate of the Mesa Directiva */}
      <div className="p-8 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-red-400 uppercase tracking-widest font-sans">
          <BookOpen className="w-4 h-4" />
          <span>Reglamento Interno y Estatuto de Ciudadanía Juvenil</span>
        </div>
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
          Competencias y Funciones Reglamentarias
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 dark:text-white">Presidencia</h4>
            <p>
              Ejerce la representación legal y política del Consejo. Firma las resoluciones y proposiciones de plenaria, modera los debates y convoca a las sesiones ordinarias y extraordinarias.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 dark:text-white">Vicepresidencia</h4>
            <p>
              Secunda al Presidente y lo suple en faltas temporales o accidentales. Coordina la articulación de las comisiones temáticas y el enlace con organizaciones de base comunitaria.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 dark:text-white">Secretaría General</h4>
            <p>
              Elabora, custodia y publica las actas de plenaria. Lleva el registro del quórum, certifica las votaciones y administra la correspondencia y los radicados del CMJ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
