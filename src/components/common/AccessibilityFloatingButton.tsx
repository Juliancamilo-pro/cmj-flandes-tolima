/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Eye, Volume2, Square } from 'lucide-react';

export const AccessibilityFloatingButton: React.FC = () => {
  const { setAccessibilityModalOpen, isSpeaking, stopSpeech, readCurrentPage } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 no-print">
      {/* Mini quick-speech floating pill when active */}
      {isSpeaking && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900 text-white text-xs shadow-lg border border-emerald-400/50 animate-bounce">
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span>Leyendo...</span>
          <button
            onClick={stopSpeech}
            className="p-1 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white"
            title="Detener voz"
          >
            <Square className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main floating accessibility trigger */}
      <button
        onClick={() => setAccessibilityModalOpen(true)}
        aria-label="Herramientas de accesibilidad para personas con discapacidad (Alt + A)"
        title="Herramientas de Accesibilidad e Inclusión (Lector de pantalla, alto contraste, texto grande, dislexia)"
        className="group relative flex items-center gap-2.5 px-3.5 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold shadow-xl border-2 border-white dark:border-stone-800 transition-all transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
      >
        {/* Universal Accessibility / Eye Icon */}
        <div className="relative">
          <Eye className="w-5 h-5 text-stone-950 shrink-0" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-800"></span>
          </span>
        </div>

        <span className="hidden sm:inline text-xs font-bold tracking-tight">
          Accesibilidad
        </span>

        {/* Hover label hint */}
        <span className="sr-only">
          Abrir panel de opciones para personas con discapacidad visual, auditiva o motriz
        </span>
      </button>
    </div>
  );
};
