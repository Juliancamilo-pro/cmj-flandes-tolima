/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  FileText,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Grid,
  List,
  Eye,
  SlidersHorizontal,
  Bookmark,
  Shield,
  Flag,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { MediaItem } from '../../types';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { MediaUploaderModal } from '../common/MediaUploaderModal';

interface MediaLibraryModuleProps {
  onSelectForField?: (url: string) => void;
  selectionMode?: boolean;
}

export const MediaLibraryModule: React.FC<MediaLibraryModuleProps> = ({
  onSelectForField,
  selectionMode = false,
}) => {
  const { settings, updateSettings } = useSiteSettings();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selection & modals
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState<boolean>(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    loadMedia();
  }, [typeFilter, categoryFilter]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMedia({
        type: typeFilter,
        category: categoryFilter,
        search: searchQuery,
      });
      setMediaList(data);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMedia();
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSetAsLogo = async (item: MediaItem) => {
    try {
      await updateSettings({ logoUrl: item.url });
      setActionNotice(`¡El logo del sitio se actualizó con "${item.title}"!`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Error setting logo:', err);
    }
  };

  const handleSetAsShield = async (item: MediaItem) => {
    try {
      await updateSettings({ shieldUrl: item.url });
      setActionNotice(`¡El escudo oficial se actualizó con "${item.title}"!`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Error setting shield:', err);
    }
  };

  const handleSetAsBanner = async (item: MediaItem) => {
    try {
      await updateSettings({ heroBannerUrl: item.url });
      setActionNotice(`¡El banner principal se actualizó con "${item.title}"!`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Error setting banner:', err);
    }
  };

  const handleDeleteItem = async (item: MediaItem) => {
    try {
      await api.deleteMedia(item.id);
      setMediaList(prev => prev.filter(m => m.id !== item.id));
      setSelectedIds(prev => prev.filter(id => id !== item.id));
      setDeleteConfirmItem(null);
      if (previewMedia?.id === item.id) setPreviewMedia(null);
      setActionNotice(`Archivo "${item.title}" eliminado correctamente.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      console.error('Error deleting media:', err);
      alert(err.message || 'Error al eliminar el archivo multimedia.');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`¿Está seguro de eliminar ${selectedIds.length} archivos multimedia seleccionados?`)) return;

    try {
      const res = await api.batchDeleteMedia(selectedIds);
      setMediaList(prev => prev.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      setActionNotice(res.message);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar archivos.');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'all', label: 'Todas las Categorías' },
    { id: 'institucional', label: 'Institucional / Logos' },
    { id: 'territorio', label: 'Territorio Flandes' },
    { id: 'eventos', label: 'Eventos y Asambleas' },
    { id: 'consejeros', label: 'Consejeros' },
    { id: 'documentos', label: 'Gacetas y Documentos' },
    { id: 'general', label: 'General' },
  ];

  return (
    <div className="space-y-6">
      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-900 dark:text-emerald-300 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            &times;
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
            Gestión Multimedia Oficial
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-1">
            Biblioteca de Fotografías y Videos
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Repositorio central de imágenes territoriales, emblemas, actas fotográficas y videos para el portal institucional de Flandes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-3.5 py-2 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsUploaderOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Fotografía o Video</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Todo', icon: SlidersHorizontal },
            { id: 'image', label: 'Fotografías', icon: ImageIcon },
            { id: 'video', label: 'Videos', icon: Video },
            { id: 'document', label: 'Documentos', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  typeFilter === tab.id
                    ? 'bg-red-900 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Category selector */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-900"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </form>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none text-stone-700 dark:text-stone-300"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-red-900 text-white' : 'text-stone-500 hover:text-stone-800'}`}
              title="Cuadrícula"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-red-900 text-white' : 'text-stone-500 hover:text-stone-800'}`}
              title="Lista"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500 font-mono">
          Cargando archivos multimedia...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
          <ImageIcon className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            No se encontraron archivos multimedia
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Puedes subir fotografías auténticas del territorio de Flandes, emblemas oficiales o videos informativos con el botón superior.
          </p>
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-xl transition-colors"
          >
            Subir Primer Archivo
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isLogo = settings.logoUrl === item.url;
            const isBanner = settings.heroBannerUrl === item.url;
            const isShield = settings.shieldUrl === item.url;

            return (
              <div
                key={item.id}
                className={`group relative bg-white dark:bg-stone-900 rounded-xl border overflow-hidden transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-red-900 ring-2 ring-red-900/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                {/* Media Thumbnail */}
                <div className="relative aspect-video w-full bg-stone-950 overflow-hidden flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : item.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <img
                        src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    </div>
                  ) : (
                    <FileText className="w-12 h-12 text-stone-400" />
                  )}

                  {/* Multi-select Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded text-red-900 bg-white/80 border-stone-300 focus:ring-red-900"
                    />
                  </div>

                  {/* Badges: In use */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                    {isLogo && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-white rounded shadow-xs">
                        Logo Actual
                      </span>
                    )}
                    {isShield && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded shadow-xs">
                        Escudo Actual
                      </span>
                    )}
                    {isBanner && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-900 text-white rounded shadow-xs">
                        Banner Actual
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => setPreviewMedia(item)}
                      className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-lg transition-transform hover:scale-105"
                      title="Ver vista completa"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(item)}
                      className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-lg transition-transform hover:scale-105"
                      title="Copiar URL"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {selectionMode && onSelectForField && (
                      <button
                        onClick={() => onSelectForField(item.url)}
                        className="px-2.5 py-1.5 bg-red-900 text-white text-xs font-semibold rounded-lg hover:bg-red-950"
                      >
                        Seleccionar
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate" title={item.title}>
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-500">
                    <span className="uppercase tracking-wider font-semibold text-red-900 dark:text-red-400">
                      {item.category}
                    </span>
                    <span>{new Date(item.uploadedAt).toLocaleDateString('es-CO')}</span>
                  </div>

                  {/* Quick Institutional Action Links */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-1 text-[10px]">
                    <button
                      onClick={() => handleSetAsLogo(item)}
                      className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-300 font-medium"
                    >
                      Usar Logo
                    </button>
                    <button
                      onClick={() => handleSetAsBanner(item)}
                      className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 hover:bg-red-100 dark:hover:bg-red-950 text-stone-700 dark:text-stone-300 font-medium"
                    >
                      Usar Banner
                    </button>
                    <button
                      onClick={() => setDeleteConfirmItem(item)}
                      className="ml-auto p-1 text-stone-400 hover:text-red-600 transition-colors"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
          {mediaList.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-4 h-4 rounded text-red-900 focus:ring-red-900"
                />
                <div className="w-12 h-12 rounded-lg bg-stone-950 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  ) : item.type === 'video' ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <FileText className="w-6 h-6 text-stone-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    {item.description || item.altText || item.name}
                  </p>
                  <span className="text-[10px] text-red-900 dark:text-red-400 uppercase font-semibold">
                    {item.category} • {item.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="px-2.5 py-1 text-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg flex items-center gap-1"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar URL</span>
                </button>
                <button
                  onClick={() => setPreviewMedia(item)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white"
                  title="Vista previa"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmItem(item)}
                  className="p-1.5 text-stone-400 hover:text-red-600"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploader Modal */}
      <MediaUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploaded={(newMedia) => {
          setMediaList(prev => [newMedia, ...prev]);
          setActionNotice(`¡Archivo "${newMedia.title}" guardado en la biblioteca!`);
          setTimeout(() => setActionNotice(null), 4000);
        }}
      />

      {/* Media Detail & Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
              <h3 className="text-sm font-bold font-serif text-stone-900 dark:text-white truncate">
                {previewMedia.title}
              </h3>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-[460px]">
                {previewMedia.type === 'image' ? (
                  <img
                    src={previewMedia.url}
                    alt={previewMedia.altText || previewMedia.title}
                    className="max-h-[460px] w-auto object-contain"
                  />
                ) : previewMedia.type === 'video' ? (
                  previewMedia.isExternal ? (
                    <iframe
                      src={previewMedia.url}
                      title={previewMedia.title}
                      className="w-full aspect-video"
                      allowFullScreen
                    />
                  ) : (
                    <video src={previewMedia.url} controls className="max-h-[460px] w-full" />
                  )
                ) : (
                  <div className="p-12 text-center text-white">
                    <FileText className="w-16 h-16 mx-auto mb-2 text-red-400" />
                    <span>Documento institucional</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600 dark:text-stone-400 pt-2">
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Texto Alternativo:</span>
                  <p>{previewMedia.altText || 'Sin texto alternativo'}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Categoría:</span>
                  <p className="uppercase">{previewMedia.category}</p>
                </div>
                {previewMedia.description && (
                  <div className="md:col-span-2">
                    <span className="font-bold text-stone-900 dark:text-white block">Descripción:</span>
                    <p>{previewMedia.description}</p>
                  </div>
                )}
                <div className="md:col-span-2 font-mono text-[11px] bg-stone-50 dark:bg-stone-800 p-2.5 rounded-lg flex items-center justify-between break-all">
                  <span>{previewMedia.url}</span>
                  <button
                    onClick={() => handleCopyUrl(previewMedia)}
                    className="ml-2 px-2.5 py-1 bg-red-900 text-white rounded font-sans font-semibold shrink-0"
                  >
                    {copiedId === previewMedia.id ? '¡Copiado!' : 'Copiar URL'}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSetAsLogo(previewMedia)}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 rounded-lg text-stone-800 dark:text-stone-200"
                >
                  Usar como Logo
                </button>
                <button
                  onClick={() => handleSetAsShield(previewMedia)}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 rounded-lg text-stone-800 dark:text-stone-200"
                >
                  Usar como Escudo
                </button>
                <button
                  onClick={() => handleSetAsBanner(previewMedia)}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-900 hover:bg-red-950 text-white rounded-lg"
                >
                  Usar como Banner Principal
                </button>
              </div>

              <button
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-white">
                ¿Eliminar archivo multimedia?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Está a punto de eliminar permanentemente <span className="font-semibold text-stone-800 dark:text-stone-200">"{deleteConfirmItem.title}"</span>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmItem)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-xl"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
