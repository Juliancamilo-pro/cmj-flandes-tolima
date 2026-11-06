/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSize = 'normal' | 'large' | 'xlarge' | 'xxlarge';
export type ContrastMode = 'normal' | 'dark-yellow' | 'light-black' | 'grayscale';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  dyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  readingGuide: boolean;
  toggleReadingGuide: () => void;
  bigCursor: boolean;
  toggleBigCursor: () => void;
  stopAnimations: boolean;
  toggleStopAnimations: () => void;
  highlightLinks: boolean;
  toggleHighlightLinks: () => void;
  isAccessibilityModalOpen: boolean;
  setAccessibilityModalOpen: (open: boolean) => void;
  // Screen Reader (Voz y Síntesis)
  isSpeaking: boolean;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speakText: (text: string) => void;
  stopSpeech: () => void;
  readCurrentPage: () => void;
  resetAccessibility: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('cmj_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('cmj_font_size') as FontSize) || 'normal';
  });

  const [contrastMode, setContrastModeState] = useState<ContrastMode>(() => {
    return (localStorage.getItem('cmj_contrast_mode') as ContrastMode) || 'normal';
  });

  const [dyslexicFont, setDyslexicFont] = useState<boolean>(() => {
    return localStorage.getItem('cmj_dyslexic_font') === 'true';
  });

  const [readingGuide, setReadingGuide] = useState<boolean>(() => {
    return localStorage.getItem('cmj_reading_guide') === 'true';
  });

  const [bigCursor, setBigCursor] = useState<boolean>(() => {
    return localStorage.getItem('cmj_big_cursor') === 'true';
  });

  const [stopAnimations, setStopAnimations] = useState<boolean>(() => {
    return localStorage.getItem('cmj_stop_animations') === 'true';
  });

  const [highlightLinks, setHighlightLinks] = useState<boolean>(() => {
    return localStorage.getItem('cmj_highlight_links') === 'true';
  });

  const [isAccessibilityModalOpen, setAccessibilityModalOpen] = useState(false);

  // Text to Speech
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  // Sync Dark Mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('cmj_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cmj_theme', 'light');
    }
  }, [isDark]);

  // Sync Font Size
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-large', 'font-xlarge', 'font-xxlarge');
    if (fontSize === 'large') root.classList.add('font-large');
    if (fontSize === 'xlarge') root.classList.add('font-xlarge');
    if (fontSize === 'xxlarge') root.classList.add('font-xxlarge');
    localStorage.setItem('cmj_font_size', fontSize);
  }, [fontSize]);

  // Sync Contrast Modes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('contrast-dark-yellow', 'contrast-light-black', 'contrast-grayscale');
    if (contrastMode === 'dark-yellow') root.classList.add('contrast-dark-yellow');
    if (contrastMode === 'light-black') root.classList.add('contrast-light-black');
    if (contrastMode === 'grayscale') root.classList.add('contrast-grayscale');
    localStorage.setItem('cmj_contrast_mode', contrastMode);
  }, [contrastMode]);

  // Sync Dyslexic Font
  useEffect(() => {
    const root = document.documentElement;
    if (dyslexicFont) root.classList.add('dyslexic-font');
    else root.classList.remove('dyslexic-font');
    localStorage.setItem('cmj_dyslexic_font', String(dyslexicFont));
  }, [dyslexicFont]);

  // Sync Big Cursor
  useEffect(() => {
    const root = document.documentElement;
    if (bigCursor) root.classList.add('big-cursor');
    else root.classList.remove('big-cursor');
    localStorage.setItem('cmj_big_cursor', String(bigCursor));
  }, [bigCursor]);

  // Sync Stop Animations
  useEffect(() => {
    const root = document.documentElement;
    if (stopAnimations) root.classList.add('stop-animations');
    else root.classList.remove('stop-animations');
    localStorage.setItem('cmj_stop_animations', String(stopAnimations));
  }, [stopAnimations]);

  // Sync Highlight Links
  useEffect(() => {
    const root = document.documentElement;
    if (highlightLinks) root.classList.add('highlight-links');
    else root.classList.remove('highlight-links');
    localStorage.setItem('cmj_highlight_links', String(highlightLinks));
  }, [highlightLinks]);

  // Mouse reading guide tracking
  useEffect(() => {
    if (!readingGuide) return;
    const guideEl = document.getElementById('accessibility-reading-guide');
    const handleMouseMove = (e: MouseEvent) => {
      if (guideEl) {
        guideEl.style.top = `${e.clientY - 12}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  // Text to Speech logic (Web Speech API)
  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) {
        alert('Tu navegador no soporta síntesis de voz interactiva.');
        return;
      }
      stopSpeech();

      const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.lang = 'es-CO';

      // Pick Spanish voice if available
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es') || v.name.includes('Spanish'));
      if (spanishVoice) utterance.voice = spanishVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [speechRate, stopSpeech]
  );

  const readCurrentPage = useCallback(() => {
    // Select main content text
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const text = mainEl.innerText || '';
      speakText(`Consejo Municipal de Juventud de Flandes. ${text.slice(0, 3000)}`);
    } else {
      speakText('Página oficial del Consejo Municipal de Juventud de Flandes, Tolima.');
    }
  }, [speakText]);

  const toggleDarkMode = () => setIsDark(prev => !prev);
  const setFontSize = (size: FontSize) => setFontSizeState(size);
  const setContrastMode = (mode: ContrastMode) => setContrastModeState(mode);
  const toggleDyslexicFont = () => setDyslexicFont(prev => !prev);
  const toggleReadingGuide = () => setReadingGuide(prev => !prev);
  const toggleBigCursor = () => setBigCursor(prev => !prev);
  const toggleStopAnimations = () => setStopAnimations(prev => !prev);
  const toggleHighlightLinks = () => setHighlightLinks(prev => !prev);

  const resetAccessibility = () => {
    setFontSizeState('normal');
    setContrastModeState('normal');
    setDyslexicFont(false);
    setReadingGuide(false);
    setBigCursor(false);
    setStopAnimations(false);
    setHighlightLinks(false);
    stopSpeech();
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDarkMode,
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
        isAccessibilityModalOpen,
        setAccessibilityModalOpen,
        isSpeaking,
        speechRate,
        setSpeechRate,
        speakText,
        stopSpeech,
        readCurrentPage,
        resetAccessibility,
      }}
    >
      {readingGuide && (
        <div
          id="accessibility-reading-guide"
          className="fixed left-0 right-0 h-8 pointer-events-none z-50 bg-amber-400/25 border-y-2 border-amber-600/70"
          style={{ top: '50%' }}
        />
      )}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
