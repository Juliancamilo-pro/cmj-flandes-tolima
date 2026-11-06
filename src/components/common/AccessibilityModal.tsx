/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Square,
  Eye,
  Type,
  MousePointer,
  RotateCcw,
  Sparkles,
  ZapOff,
  Link,
  BookOpen,
  Check,
} from 'lucide-react';

export const AccessibilityModal: React.FC = () => {
  const {
    isAccessibilityModalOpen,
    setAccessibilityModalOpen,
    fontSize,
    setFontSize,
    contrastMode,
    setContrastMode,
    dyslexicFont,
    toggleDyslexicFont,
    readingGuide,
    toggleReadingGuide,
    bigCursor,
    toggleBigCursor,
    stopAnimations,
    toggleStopAnimations,
    highlightLinks,
    toggleHighlightLinks,
    isSpeaking,
    speechRate,
    setSpeechRate,
    readCurrentPage,
    stopSpeech,
    resetAccessibility,
  } = useTheme();

  if (!isAccessibilityModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel de Herramientas de Accesibilidad e Inclusión"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border-2 border-amber-600/50 p-6 sm:p-8">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-800 via-amber-500 to-red-900" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-white">
                Accesibilidad e Inclusión
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ajustes adaptados a la Resolución 1519/2020 MinTIC y WCAG 2.1 AA
              </p>
            </div>
          </div>
          <button
            onClick={() => setAccessibilityModalOpen(false)}
            aria-label="Cerrar panel de accesibilidad"
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Section 1: Lector de Pantalla Interactivo (Voz en Español) */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-red-900 dark:text-red-400" />
                <span className="text-sm font-bold text-stone-900 dark:text-white">
                  Lector de Pantalla (Síntesis de Voz)
                </span>
              </div>
              {isSpeaking && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 animate-pulse">
                  ● Leyendo en voz alta
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 mb-3">
              Reproduce el contenido sonoro de la página para personas con discapacidad visual, baja visión o fatiga ocular.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={readCurrentPage}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-900 hover:bg-red-950 text-white flex items-center gap-2 shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Reiniciar Lectura' : 'Leer Página Actual'}</span>
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeech}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 flex items-center gap-2 transition-colors"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Detener Voz</span>
                </button>
              )}

              {/* Speed selection */}
              <div className="flex items-center gap-1.5 ml-auto text-xs text-stone-600 dark:text-stone-300">
                <span className="text-[11px]">Velocidad:</span>
                {[0.8, 1.0, 1.2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                      speechRate === rate
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Tamaño Tipográfico (Escalamiento de Fuente) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                Tamaño de Letra
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'normal', label: 'A', sub: 'Normal (100%)' },
                { id: 'large', label: 'A+', sub: 'Grande (+12%)' },
                { id: 'xlarge', label: 'A++', sub: 'Extra (+25%)' },
                { id: 'xxlarge', label: 'A+++', sub: 'Máximo (+40%)' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setFontSize(item.id as any)}
                  className={`p-3 text-center rounded-xl border transition-all ${
                    fontSize === item.id
                      ? 'border-red-900 dark:border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-bold ring-2 ring-red-900/20'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="text-base font-bold">{item.label}</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Modos de Contraste Visual */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                Contraste y Visión
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'normal', name: 'Estándar', desc: 'Diseño institucional' },
                { id: 'dark-yellow', name: 'Negro / Amarillo', desc: 'Baja visión (WCAG AAA)' },
                { id: 'light-black', name: 'Blanco / Negro', desc: 'Alto contraste claro' },
                { id: 'grayscale', name: 'Escala de Grises', desc: 'Monocromático' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setContrastMode(m.id as any)}
                  className={`p-2.5 text-left rounded-xl border transition-all ${
                    contrastMode === m.id
                      ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold ring-2 ring-amber-600/30'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="text-xs font-bold">{m.name}</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Herramientas Cognitivas y Motoras */}
          <div>
            <span className="block text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-2">
              Herramientas de Apoyo Especial
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Dyslexia font */}
              <button
                onClick={toggleDyslexicFont}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                  dyslexicFont
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold">Fuente para Dislexia</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Espaciado y caracteres legibles</div>
                  </div>
                </div>
                {dyslexicFont && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Reading Guide */}
              <button
                onClick={toggleReadingGuide}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                  readingGuide
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold">Guía de Lectura</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Regla visual que sigue el mouse</div>
                  </div>
                </div>
                {readingGuide && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Big Cursor */}
              <button
                onClick={toggleBigCursor}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                  bigCursor
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MousePointer className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold">Cursor Grande</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Puntero ampliado de alto contraste</div>
                  </div>
                </div>
                {bigCursor && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Stop Animations */}
              <button
                onClick={toggleStopAnimations}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                  stopAnimations
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ZapOff className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold">Detener Animaciones</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Para usuarios fotosensibles</div>
                  </div>
                </div>
                {stopAnimations && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Highlight Links */}
              <button
                onClick={toggleHighlightLinks}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors sm:col-span-2 ${
                  highlightLinks
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Link className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold">Resaltar Enlaces y Botones Interactivos</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Subrayado y contorno visible para fácil navegación</div>
                  </div>
                </div>
                {highlightLinks && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            onClick={resetAccessibility}
            className="px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-red-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Todo</span>
          </button>

          <button
            onClick={() => setAccessibilityModalOpen(false)}
            className="px-5 py-2 text-xs font-bold text-white bg-red-900 hover:bg-red-950 rounded-lg shadow-sm transition-colors"
          >
            Aceptar y Guardar Preferencias
          </button>
        </div>
      </div>
    </div>
  );
};
