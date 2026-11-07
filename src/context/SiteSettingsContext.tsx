/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<SiteSettings>;
  refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Consejo Municipal de Juventud Flandes',
  municipality: 'Flandes',
  department: 'Tolima',
  period: '2024 - 2026',
  logoUrl: '/src/assets/images/cmj_flandes_emblem_1793990337067.jpg',
  shieldUrl: '/src/assets/images/cmj_flandes_emblem_1793990337067.jpg',
  heroBannerUrl: '/src/assets/images/flandes_river_landscape_1793990334929.jpg',
  heroTitle: 'Consejo Municipal de Juventud de Flandes',
  heroSubtitle: 'Voz, liderazgo y transformación social para las juventudes de la Puerta de Oro del Tolima.',
  heroBadge: 'Órgano Autónomo de Participación Juvenil • Ley 1622 de 2013',
  address: 'Carrera 8 con Calle 10, Palacio Municipal, Flandes, Tolima, Colombia',
  contactEmail: 'trujillogordilooo@gmail.com',
  contactPhone: '+57 312 456 7890',
  officeHours: 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 5:00 PM',
  socialLinks: {
    facebook: 'https://facebook.com/CMJFlandesOficial',
    instagram: 'https://instagram.com/cmj_flandes',
    twitter: 'https://twitter.com/CMJFlandes',
    youtube: 'https://youtube.com/@cmjflandes',
  },
  customAnnouncements: 'Convocatoria abierta para mesas temáticas de juventud y veeduría ciudadana 2026.',
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSettings = async () => {
    try {
      const data = await api.getSiteSettings();
      if (data && data.siteName) {
        setSettings(data);
      }
    } catch (err) {
      console.warn('Could not load site settings, using default:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const updated = await api.updateSiteSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
