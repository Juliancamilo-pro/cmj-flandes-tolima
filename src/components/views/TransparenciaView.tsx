/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, Scale, ExternalLink, Download } from 'lucide-react';

interface TransparenciaViewProps {
  onNavigate: (view: string) => void;
}

export const TransparenciaView: React.FC<TransparenciaViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Ley 1712 de 2014 y Control Social
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Transparencia y Acceso a la Información
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Cumplimiento del principio de máxima publicidad, rendición de cuentas e informes de gestión del Consejo Municipal de Juventud de Flandes (Tolima).
        </p>
      </div>

      {/* Grid of Transparency Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="p-3 w-fit rounded-lg bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
            1. Publicidad de Actas y Decisiones
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            El 100% de las actas de plenaria, convocatorias a sesiones ordinarias y extraordinarias, y resoluciones adoptadas por el CMJ se encuentran disponibles para consulta pública y descarga en el repositorio documental oficial.
          </p>
          <button
            onClick={() => onNavigate('documentos')}
            className="text-xs font-semibold text-red-900 dark:text-red-400 hover:underline pt-2 block"
          >
            Ir a la biblioteca documental →
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="p-3 w-fit rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
            2. Rendición Pública de Cuentas
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            El Consejo realiza audiencias semestrales de rendición pública de cuentas en el recinto del Concejo Municipal o en la Casa de la Cultura, presentando informes de gestión escritos con balance de proposiciones e interlocución con la Alcaldía.
          </p>
          <button
            onClick={() => onNavigate('documentos')}
            className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline pt-2 block"
          >
            Descargar informe de gestión 2025 →
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="p-3 w-fit rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
            3. Seguimiento a Compromisos y Tareas
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            El portal privado de los consejeros cuenta con un módulo de seguimiento a compromisos que registra asignaciones, plazos límites y evidencias para garantizar el cumplimiento del plan de trabajo institucional.
          </p>
          <button
            onClick={() => onNavigate('gestion')}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline pt-2 block"
          >
            Ver balance de gestión →
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="p-3 w-fit rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
            4. Canal Abierto de PQRSF y Solicitudes
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Cualquier ciudadano puede radicar peticiones, quejas, reclamos o propuestas ante el CMJ recibiendo un número de radicado legal y respuesta en los términos de la Ley 1755 de 2015.
          </p>
          <button
            onClick={() => onNavigate('participacion')}
            className="text-xs font-semibold text-blue-800 dark:text-blue-400 hover:underline pt-2 block"
          >
            Ir al buzón ciudadano →
          </button>
        </div>
      </div>

      {/* Compliance statement */}
      <div className="p-6 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-2 font-mono">
        <p className="font-bold text-stone-800 dark:text-stone-200">
          DECLARACIÓN DE INTEGRIDAD INSTITUCIONAL:
        </p>
        <p>
          Los miembros del Consejo Municipal de Juventud de Flandes ejercen sus funciones de manera ad honórem, guiados por los principios de probidad, moralidad administrativa y compromiso con el desarrollo integral de las juventudes del Tolima.
        </p>
      </div>
    </div>
  );
};
