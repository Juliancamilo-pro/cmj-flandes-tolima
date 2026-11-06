/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Eye, Compass, Heart, Award, Users } from 'lucide-react';

export const QuienesSomosView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Identidad Institucional
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Quiénes Somos
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Historia, misión, visión y principios que guían la representatividad democrática del Consejo Municipal de Juventud de Flandes, Tolima.
        </p>
      </div>

      {/* History & Territorial Context */}
      <div className="p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
        <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
          Historia y Participación Juvenil en Flandes
        </h2>
        <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed space-y-3 font-sans">
          <p>
            Flandes, puerta de oro del departamento del Tolima y puerto histórico sobre el majestuoso Río Magdalena, cuenta con una población juvenil vibrante distribuida en sus barrios urbanos y sus tradicionales veredas (Paradero, Colegio, Topacio y Camala).
          </p>
          <p>
            La historia de la participación juvenil en Flandes ha estado marcada por la búsqueda de oportunidades educativas, el acceso al transporte intermunicipal con los centros universitarios vecinos de Girardot e Ibagué, y la defensa de la cultura ribereña y el medio ambiente.
          </p>
          <p>
            Con la reactivación democrática del Sistema Nacional de Juventudes a través del Estatuto de Ciudadanía Juvenil, las y los jóvenes flamencos eligieron en las urnas a sus consejeros municipales de juventud, consolidando un cuerpo colegiado plural que integra listas independientes de jóvenes organizados, partidos políticos, colectivos culturales y representaciones de sectores rurales y diferenciales.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
          <div className="p-3 w-fit rounded-lg bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
            Misión Institucional
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            Representar y defender con autonomía, transparencia y rigor democrático los derechos, inquietudes y propuestas de las juventudes del municipio de Flandes. Concertar con el gobierno municipal la inclusión efectiva de los jóvenes en las políticas públicas, el presupuesto y los planes de desarrollo territorial.
          </p>
        </div>

        <div className="p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
          <div className="p-3 w-fit rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
            Visión Institucional
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            Consolidar al Consejo Municipal de Juventud de Flandes como un referente departamental y nacional de gobernanza juvenil, control social constructivo y liderazgo propositivo, transformando realidades y garantizando que ningún joven de Flandes se quede atrás en educación, empleo, cultura y bienestar.
          </p>
        </div>
      </div>

      {/* Institutional Principles */}
      <div className="space-y-6">
        <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
          Principios Institucionales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="text-xs font-bold text-red-900 dark:text-red-400 font-sans uppercase">
              1. Autonomía
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Independencia de criterio frente a cualquier interés particular, actuando siempre en beneficio del bienestar colectivo de los jóvenes de Flandes.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="text-xs font-bold text-amber-800 dark:text-amber-400 font-sans uppercase">
              2. Transparencia
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Publicidad abierta de todas las actas, resoluciones, proposiciones y decisiones tomadas en el recinto del consejo.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 font-sans uppercase">
              3. Inclusión y Diversidad
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Voz paritaria y con enfoque territorial para las juventudes de barrios urbanos, veredas rurales y comunidades diversas.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="text-xs font-bold text-blue-800 dark:text-blue-400 font-sans uppercase">
              4. Corresponsabilidad
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Compromiso ético con la comunidad y trabajo mancomunado con las instituciones del Estado colombiano.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="text-xs font-bold text-purple-800 dark:text-purple-400 font-sans uppercase">
              5. Enfoque de Paz
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Promoción activa del diálogo, la resolución pacífica de conflictos y la convivencia ciudadana entre las juventudes.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 font-sans uppercase">
              6. Defensa del Territorio
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Cuidado y preservación del patrimonio natural, ecológico e hídrico del Río Magdalena y la tierra tolimense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
