/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Scale, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export const LegislacionView: React.FC = () => {
  const laws = [
    {
      title: 'Ley Estatutaria 1622 de 2013',
      subtitle: 'Estatuto de Ciudadanía Juvenil en Colombia',
      description: 'Marco jurídico que establece las capacidades, competencias y derechos de las juventudes colombianas (entre 14 y 28 años). Crea formalmente el Sistema Nacional de las Juventudes y los Consejos de Juventud en todos los municipios del país.',
      link: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53075',
      topics: ['Definición de juventud', 'Comisiones de concertación', 'Elección popular de consejeros'],
    },
    {
      title: 'Ley 1885 de 2018',
      subtitle: 'Reforma y Fortalecimiento del Estatuto de Juventud',
      description: 'Modifica la Ley 1622 para garantizar la elección democrática directa y paritaria de los Consejos Municipales, Locales y Departamentales de Juventud. Fija los mecanismos de financiación, garantías electorales y curules especiales para comunidades étnicas y campesinas.',
      link: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=85449',
      topics: ['Paridad de género 50/50 en listas', 'Curul campesina y étnica', 'Régimen de sesiones'],
    },
    {
      title: 'Ley 1757 de 2015',
      subtitle: 'Estatuto de Participación Democrática y Control Social',
      description: 'Regula las modalidades del derecho a participar en la vida política, administrativa, económica, social y cultural, así como el control social a lo público por parte de organizaciones y veedurías juveniles.',
      link: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334',
      topics: ['Veedurías ciudadanas', 'Audiencias públicas', 'Presupuestos participativos'],
    },
    {
      title: 'Reglamento Interno del CMJ Flandes',
      subtitle: 'Resolución N° 002 de 2026',
      description: 'Norma interna que disciplina la conformación de la Mesa Directiva, el trámite de proposiciones, los tipos de sesiones ordinarias y extraordinarias, las faltas y el régimen de quórum del Consejo Municipal de Juventud de Flandes.',
      link: '#',
      topics: ['Quórum decisorio', 'Comisiones permanentes', 'Moción de orden'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Fundamentos del Derecho Juvenil Colombiano
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Legislación y Normatividad Juvenil
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Compendio de normas oficiales que rigen el ejercicio democrático, las competencias y la interlocución institucional del Consejo Municipal de Juventud de Flandes.
        </p>
      </div>

      <div className="space-y-6">
        {laws.map((law, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-red-900 dark:text-red-400 font-sans">
                {law.subtitle}
              </span>
              {law.link !== '#' && (
                <a
                  href={law.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-stone-500 hover:text-red-900 dark:hover:text-red-400 flex items-center gap-1"
                >
                  <span>Consultar en Función Pública</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
              {law.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {law.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {law.topics.map((t, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
