/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import {
  Moon,
  Sun,
  Eye,
  Type,
  Lock,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  FileText,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenLogin }) => {
  const { user, logout } = useAuth();
  const { settings } = useSiteSettings();
  const { isDark, toggleDarkMode, fontSize, setFontSize, setAccessibilityModalOpen } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const mainNavItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'presentacion', label: 'Presentación' },
    { id: 'integrantes', label: 'Integrantes' },
    { id: 'sesiones', label: 'Sesiones' },
    { id: 'documentos', label: 'Actas y Documentos' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'participacion', label: 'Participación Juvenil' },
  ];

  const moreNavItems = [
    { id: 'quienes-somos', label: 'Quiénes Somos' },
    { id: 'mesa-directiva', label: 'Mesa Directiva' },
    { id: 'comisiones', label: 'Comisiones de Trabajo' },
    { id: 'noticias', label: 'Sala de Prensa' },
    { id: 'actividades', label: 'Agenda de Actividades' },
    { id: 'encuestas', label: 'Encuestas Públicas' },
    { id: 'transparencia', label: 'Transparencia y Gestión' },
    { id: 'legislacion', label: 'Marco Legal (Ley 1622)' },
    { id: 'contacto', label: 'Atención y Contacto' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Colombian Tricolor Institutional Stripe */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/2 bg-[#FCD116]" title="Amarillo Colombia" />
        <div className="h-full w-1/4 bg-[#003893]" title="Azul Colombia" />
        <div className="h-full w-1/4 bg-[#CE1126]" title="Rojo Colombia" />
      </div>

      {/* Institutional Utility & Accessibility Ribbon */}
      <div className="bg-stone-100 dark:bg-stone-950 px-4 sm:px-6 py-1.5 text-xs text-stone-600 dark:text-stone-400 border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-red-900 dark:text-red-400">REPÚBLICA DE COLOMBIA</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="truncate">Municipio de Flandes, Tolima</span>
            <span aria-hidden="true" className="hidden sm:inline text-stone-300 dark:text-stone-700">·</span>
            <span className="hidden sm:inline text-amber-700 dark:text-amber-400 font-medium">Estatuto de Ciudadanía Juvenil</span>
          </div>

          {/* Accessibility Controls & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Font size toggles */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-200/70 dark:bg-stone-800 rounded px-1.5 py-0.5">
              <span className="text-[10px] uppercase font-bold text-stone-500 mr-1">Texto:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1 rounded text-xs transition-colors ${fontSize === 'normal' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white font-bold' : 'hover:text-stone-900 dark:hover:text-white'}`}
                title="Tamaño normal de texto"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1 rounded text-sm transition-colors ${fontSize === 'large' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white font-bold' : 'hover:text-stone-900 dark:hover:text-white'}`}
                title="Texto grande (+10%)"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1 rounded text-base transition-colors ${fontSize === 'xlarge' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white font-bold' : 'hover:text-stone-900 dark:hover:text-white'}`}
                title="Texto extra grande (+25%)"
              >
                A++
              </button>
            </div>

            {/* Open Full Accessibility & Disability Tools Modal */}
            <button
              onClick={() => setAccessibilityModalOpen(true)}
              className="px-2 py-0.5 rounded text-xs flex items-center gap-1.5 font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 border border-amber-600/40 transition-colors"
              title="Herramientas de accesibilidad para personas con discapacidad (Voz, Contraste, Dislexia)"
              aria-label="Abrir panel de herramientas de accesibilidad"
            >
              <Eye className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Accesibilidad</span>
            </button>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded hover:text-stone-900 dark:hover:text-white transition-colors"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Alternar tema claro y oscuro"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Top Bar (Strict One-Row, Three-Zone Top Bar Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <button
          onClick={() => handleNavClick('inicio')}
          className="text-left flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-900"
        >
          <img
            src={settings.logoUrl || settings.shieldUrl || "/src/assets/images/cmj_flandes_emblem_1793990337067.jpg"}
            alt="Escudo oficial CMJ Flandes"
            className="w-10 h-10 rounded-full object-cover shadow-xs border border-amber-500/40 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-red-950 dark:text-red-100 whitespace-nowrap">
              CMJ {settings.municipality.toUpperCase()}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-widest font-sans font-medium">
              {settings.department} · Colombia
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-Line, 4-5 core links + dropdown) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-700 dark:text-stone-300">
          {mainNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`whitespace-nowrap transition-colors py-1 hover:text-red-900 dark:hover:text-red-400 ${
                currentView === item.id
                  ? 'text-red-900 dark:text-red-400 font-semibold border-b-2 border-red-900 dark:border-red-400'
                  : ''
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* More Sections Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(prev => !prev)}
              className="flex items-center gap-1 py-1 hover:text-red-900 dark:hover:text-red-400 transition-colors whitespace-nowrap"
            >
              <span>Más</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                {moreNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
                      currentView === item.id
                        ? 'text-red-900 dark:text-red-400 font-semibold bg-red-50/50 dark:bg-red-950/30'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Primary Action / User Portal Status */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('portal-privado')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Panel Consejero</span>
                <span className="sm:hidden">Panel</span>
              </button>

              <button
                onClick={logout}
                className="p-2 text-stone-600 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                title="Cerrar sesión institucional"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 dark:bg-red-800 dark:hover:bg-red-900 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Consejeros</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 space-y-1 shadow-lg max-h-[75vh] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-3 py-1">
            Secciones Principales
          </div>
          {mainNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                currentView === item.id
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-400 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-3 py-1">
              Más Información Institucional
            </div>
            {moreNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                  currentView === item.id
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
