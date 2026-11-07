/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Mail, Phone, Clock, ShieldCheck, Scale, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-stone-900 text-stone-300 dark:bg-stone-950 dark:text-stone-400 border-t border-stone-800 transition-colors">
      {/* Top Banner with Regional Flag Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-800 via-amber-600 to-red-900" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Identity & Crest */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.logoUrl || settings.shieldUrl || "/src/assets/images/cmj_flandes_emblem_1793990337067.jpg"}
                alt="Escudo CMJ Flandes"
                className="w-12 h-12 rounded-full object-cover border border-amber-500/50"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-serif font-bold text-white text-base tracking-tight leading-tight uppercase">
                  {settings.siteName}
                </h3>
                <p className="text-xs text-amber-400 font-medium">{settings.municipality} · {settings.department} · Colombia</p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Órgano colegiado de concertación, vigilancia, control social y participación democrática de las juventudes de {settings.municipality} ante la administración municipal y el Estado colombiano.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Ley 1622 de 2013 & Ley 1885 de 2018</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Estatuto de Ciudadanía Juvenil</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 font-sans">
              Portal Ciudadano
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('inicio')} className="hover:text-amber-400 transition-colors">
                  Inicio Institucional
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('presentacion')} className="hover:text-amber-400 transition-colors">
                  ¿Qué es el CMJ y funciones?
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('integrantes')} className="hover:text-amber-400 transition-colors">
                  Directorio de Consejeros
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sesiones')} className="hover:text-amber-400 transition-colors">
                  Calendario y Órdenes del Día
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('documentos')} className="hover:text-amber-400 transition-colors">
                  Archivo de Actas y Resoluciones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('proyectos')} className="hover:text-amber-400 transition-colors">
                  Iniciativas y Proyectos Juveniles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('participacion')} className="hover:text-amber-400 transition-colors">
                  Buzón de Peticiones e Iniciativas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Transparencia & Entidades Aliadas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 font-sans">
              Transparencia & Aliados
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('transparencia')} className="hover:text-amber-400 transition-colors">
                  Informes de Rendición de Cuentas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legislacion')} className="hover:text-amber-400 transition-colors">
                  Normatividad Juvenil Aplicable
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('encuestas')} className="hover:text-amber-400 transition-colors">
                  Resultados de Encuestas Públicas
                </button>
              </li>
              <li className="pt-2 border-t border-stone-800 text-stone-400">
                <a
                  href="https://www.flandes-tolima.gov.co"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Alcaldía Municipal de Flandes</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://colombiajoven.gov.co"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Colombia Joven</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tolima.gov.co"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Gobernación del Tolima</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Atención & Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 font-sans">
              Atención Presencial & Radicación
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">{settings.contactEmail}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-300">{settings.officeHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Institutional Compliance */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Consejo Municipal de Juventud de Flandes, Tolima. Plataforma Oficial.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={() => onNavigate('transparencia')} className="hover:text-white transition-colors">
              Ley de Transparencia 1712
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('legislacion')} className="hover:text-white transition-colors">
              Régimen de Juventudes
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('contacto')} className="hover:text-white transition-colors">
              PQRSF & Radicación
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
