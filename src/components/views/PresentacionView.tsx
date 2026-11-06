/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, BookOpen, Scale, CheckCircle, ArrowRight, FileText } from 'lucide-react';

interface PresentacionViewProps {
  onNavigate: (view: string) => void;
}

export const PresentacionView: React.FC<PresentacionViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Marco Institucional y Democrático
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          ¿Qué es el Consejo Municipal de Juventud (CMJ)?
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          El Consejo Municipal de Juventud de Flandes es un organismo colegiado de participación, concertación, vigilancia y control de la gestión pública, creado por mandato del Estatuto de Ciudadanía Juvenil en Colombia.
        </p>
      </div>

      {/* Hero Visual Card */}
      <div className="relative aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden shadow-md">
        <img
          src="/src/assets/images/flandes_youth_assembly_1793990336686.jpg"
          alt="Asamblea y plenaria del Consejo de Juventud"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-6">
          <p className="text-xs sm:text-sm text-stone-200 font-serif italic">
            Sesión plenaria de deliberación y concertación juvenil en Flandes, Tolima.
          </p>
        </div>
      </div>

      {/* Natural Editorial Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="p-3 w-fit rounded-lg bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-400">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
            Fundamento Legal
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Establecido por la <strong>Ley Estatutaria 1622 de 2013</strong> y modificado por la <strong>Ley 1885 de 2018</strong>. Los consejeros son elegidos democráticamente por voto popular de jóvenes de 14 a 28 años.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="p-3 w-fit rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
            Control Social y Veeduría
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Ejerce veeduría y control sobre la ejecución de los planes y programas dirigidos a las juventudes en el Plan de Desarrollo Municipal de Flandes y la inversión de recursos públicos.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="p-3 w-fit rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
            Mesa de Concertación
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            El Alcalde Municipal de Flandes tiene la obligación legal de sesionar con el CMJ al menos dos veces al año para concertar la agenda y presupuesto de las juventudes.
          </p>
        </div>
      </div>

      {/* Distinction Matrix: CMJ vs Plataforma vs Alcaldía */}
      <div className="bg-stone-50 dark:bg-stone-900/60 rounded-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 space-y-6">
        <div>
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white mb-2">
            Diferencias Institucionales Claras
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            En Colombia existen tres instancias distintas con funciones diferenciadas que no deben confundirse:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="text-xs font-bold text-red-900 dark:text-red-400 font-sans uppercase">
              Consejo Municipal de Juventud (CMJ)
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Órgano <strong>colegiado de concertación, vigilancia y control social</strong> de elección popular directa. No es ejecutor de presupuesto directo ni depende jerárquicamente del Alcalde; actúa con autonomía representativa.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="text-xs font-bold text-amber-800 dark:text-amber-400 font-sans uppercase">
              Plataforma Municipal de Juventudes (PMJ)
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Espacio <strong>amplio y autónomo de encuentro, articulación y coordinación</strong> de todas las organizaciones, parches, colectivos juveniles formales y no formales de Flandes.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="text-xs font-bold text-blue-900 dark:text-blue-400 font-sans uppercase">
              Alcaldía Municipal de Flandes
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Entidad <strong>ejecutora del orden municipal</strong> (Secretaría de Gobierno, Educación, Salud y Desarrollo Social). Es la responsable de ejecutar las políticas públicas y administrar los recursos del tesoro municipal.
            </p>
          </div>
        </div>
      </div>

      {/* Funciones Principales */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
          Funciones Principales del CMJ según la Ley 1622 de 2013
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
            <CheckCircle className="w-5 h-5 text-red-900 dark:text-red-400 shrink-0 mt-0.5" />
            <span>Actuar como interlocutor y vocero de las juventudes ante la administración municipal y entidades públicas.</span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
            <CheckCircle className="w-5 h-5 text-red-900 dark:text-red-400 shrink-0 mt-0.5" />
            <span>Concertar la inclusión de las agendas de las juventudes con las autoridades políticas y administrativas.</span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
            <CheckCircle className="w-5 h-5 text-red-900 dark:text-red-400 shrink-0 mt-0.5" />
            <span>Ejercer veeduría y control social a los planes de desarrollo y a las políticas públicas de juventud en Flandes.</span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
            <CheckCircle className="w-5 h-5 text-red-900 dark:text-red-400 shrink-0 mt-0.5" />
            <span>Promover que se asignen partidas presupuestales para programas de juventud en el presupuesto municipal anual.</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('integrantes')}
          className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Conoce a los Consejeros de Flandes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate('legislacion')}
          className="text-xs font-semibold text-red-900 dark:text-red-400 hover:underline flex items-center gap-1.5"
        >
          <FileText className="w-4 h-4" />
          <span>Ver texto completo de la Ley 1622 de 2013</span>
        </button>
      </div>
    </div>
  );
};
