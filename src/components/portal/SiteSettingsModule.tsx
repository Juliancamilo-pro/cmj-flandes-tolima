/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Image as ImageIcon,
  Save,
  Check,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Upload,
  RefreshCw,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { MediaUploaderModal } from '../common/MediaUploaderModal';

export const SiteSettingsModule: React.FC = () => {
  const { settings, updateSettings, refreshSettings } = useSiteSettings();

  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Media selector helper
  const [uploaderTarget, setUploaderTarget] = useState<'logo' | 'shield' | 'hero' | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const network = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [network]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMessage(err.message || 'Error al guardar los ajustes institucionales.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaUploaded = (media: any) => {
    if (uploaderTarget === 'logo') {
      setFormData(prev => ({ ...prev, logoUrl: media.url }));
    } else if (uploaderTarget === 'shield') {
      setFormData(prev => ({ ...prev, shieldUrl: media.url }));
    } else if (uploaderTarget === 'hero') {
      setFormData(prev => ({ ...prev, heroBannerUrl: media.url }));
    }
    setUploaderTarget(null);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
            Personalización Visual e Institucional
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-1">
            Configuración de Logos, Imágenes y Contacto
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Personaliza el emblema, escudo, banner territorial principal y datos de contacto de la sede del CMJ Flandes.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Guardar Cambios</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>¡La configuración institucional, logos y datos de contacto se han actualizado correctamente en todo el portal!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold text-red-900 dark:text-red-300 flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Visual Identity & Logos */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <ImageIcon className="w-4 h-4 text-red-800 dark:text-red-400" />
            <span>Identidad Visual (Logos, Emblema y Banner)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo URL */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Logotipo del Consejo Municipal
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden shrink-0 flex items-center justify-center p-2">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-stone-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="URL de la imagen o ruta local"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
                  />
                  <button
                    type="button"
                    onClick={() => setUploaderTarget('logo')}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir o Cambiar Logo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Shield URL */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Escudo Institucional / Emblema de Flandes
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden shrink-0 flex items-center justify-center p-2">
                  {formData.shieldUrl ? (
                    <img src={formData.shieldUrl} alt="Escudo" className="w-full h-full object-contain" />
                  ) : (
                    <Shield className="w-8 h-8 text-stone-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    name="shieldUrl"
                    value={formData.shieldUrl}
                    onChange={handleChange}
                    placeholder="URL del escudo oficial"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
                  />
                  <button
                    type="button"
                    onClick={() => setUploaderTarget('shield')}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir o Cambiar Escudo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Banner Territorial */}
            <div className="md:col-span-2 space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Banner Territorial Principal (Página de Inicio)
              </label>
              <div className="relative aspect-[21/9] max-h-56 w-full rounded-2xl bg-stone-950 overflow-hidden border border-stone-300 dark:border-stone-700">
                {formData.heroBannerUrl && (
                  <img
                    src={formData.heroBannerUrl}
                    alt="Banner principal"
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-between p-4">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                      Vista previa del banner
                    </span>
                    <h4 className="text-sm font-bold truncate">{formData.heroTitle}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploaderTarget('hero')}
                    className="px-3.5 py-1.5 bg-white text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Cambiar Imagen de Fondo</span>
                  </button>
                </div>
              </div>
              <input
                type="text"
                name="heroBannerUrl"
                value={formData.heroBannerUrl}
                onChange={handleChange}
                placeholder="URL directa de la fotografía territorial"
                className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Texts & Slogans */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <Layers className="w-4 h-4 text-red-800 dark:text-red-400" />
            <span>Títulos del Portal Principal</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Distintivo / Escarapela Superior
              </label>
              <input
                type="text"
                name="heroBadge"
                value={formData.heroBadge}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Título Principal
              </label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Subtítulo Institucional
              </label>
              <textarea
                name="heroSubtitle"
                rows={2}
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Info & Attention Hours */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <Phone className="w-4 h-4 text-red-800 dark:text-red-400" />
            <span>Datos Oficiales de Contacto y Atención</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Dirección Institucional
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Correo Electrónico Oficial
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Línea Telefónica de Atención
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Horario de Atención Ciudadana
              </label>
              <input
                type="text"
                name="officeHours"
                value={formData.officeHours}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <Globe className="w-4 h-4 text-red-800 dark:text-red-400" />
            <span>Canales Digitales y Redes Sociales</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Facebook
              </label>
              <input
                type="url"
                name="social_facebook"
                value={formData.socialLinks?.facebook || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="social_instagram"
                value={formData.socialLinks?.instagram || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                X (Twitter)
              </label>
              <input
                type="url"
                name="social_twitter"
                value={formData.socialLinks?.twitter || ''}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Canal de YouTube
              </label>
              <input
                type="url"
                name="social_youtube"
                value={formData.socialLinks?.youtube || ''}
                onChange={handleChange}
                placeholder="https://youtube.com/@..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-1 focus:ring-red-900"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Guardar Toda la Configuración</span>
          </button>
        </div>
      </form>

      {/* Media Uploader Modal for quick field selection */}
      <MediaUploaderModal
        isOpen={uploaderTarget !== null}
        onClose={() => setUploaderTarget(null)}
        onUploaded={handleMediaUploaded}
        defaultCategory="institucional"
      />
    </div>
  );
};
