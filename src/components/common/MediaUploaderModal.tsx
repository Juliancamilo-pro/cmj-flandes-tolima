/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  FileText,
  Crop,
  Check,
  AlertCircle,
  Loader2,
  Maximize2,
  Sliders,
  RefreshCw,
  Link as LinkIcon
} from 'lucide-react';
import { api } from '../../services/api';
import { MediaItem } from '../../types';

interface MediaUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (media: MediaItem) => void;
  defaultCategory?: 'institucional' | 'eventos' | 'consejeros' | 'territorio' | 'documentos' | 'general';
}

type TabMode = 'file' | 'video-url';

export const MediaUploaderModal: React.FC<MediaUploaderModalProps> = ({
  isOpen,
  onClose,
  onUploaded,
  defaultCategory = 'general',
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('file');
  const [fileType, setFileType] = useState<'image' | 'video' | 'document'>('image');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [mimeType, setMimeType] = useState<string>('');

  // Metadata form
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [altText, setAltText] = useState<string>('');
  const [category, setCategory] = useState<MediaItem['category']>(defaultCategory);

  // Video embed url state
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [externalPlatform, setExternalPlatform] = useState<'youtube' | 'vimeo' | 'otro'>('youtube');

  // Processing & Compression state
  const [quality, setQuality] = useState<number>(0.85);
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  // Sanitization for SVG
  const sanitizeSvg = (svgText: string): string => {
    // Strip scripts, event handlers, and external references
    return svgText
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  };

  // Convert File to data URL and optimize if image
  const handleFileSelection = (file: File) => {
    setErrorMsg('');
    setRawFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type || 'application/octet-stream');
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const lowerName = file.name.toLowerCase();
    const isSvg = file.type === 'image/svg+xml' || lowerName.endsWith('.svg');
    const isVideo = file.type.startsWith('video/') || lowerName.endsWith('.mp4') || lowerName.endsWith('.webm') || lowerName.endsWith('.mov');
    const isDoc = file.type.includes('pdf') || lowerName.endsWith('.pdf') || lowerName.endsWith('.doc') || lowerName.endsWith('.docx');

    if (isVideo) {
      setFileType('video');
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return;
    }

    if (isDoc) {
      setFileType('document');
      setPreviewUrl('');
      return;
    }

    // Image handling
    setFileType('image');
    const reader = new FileReader();

    if (isSvg) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const clean = sanitizeSvg(text);
        const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(clean)}`;
        setPreviewUrl(encoded);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Process & compress canvas for images
  const processImageCanvas = async (sourceDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        // Apply Aspect Ratio crop
        let startX = 0;
        let startY = 0;
        let cropWidth = img.width;
        let cropHeight = img.height;

        if (aspectRatio === '1:1') {
          const minDim = Math.min(img.width, img.height);
          startX = (img.width - minDim) / 2;
          startY = (img.height - minDim) / 2;
          cropWidth = minDim;
          cropHeight = minDim;
          targetWidth = Math.min(minDim, 1200);
          targetHeight = targetWidth;
        } else if (aspectRatio === '16:9') {
          const targetH = img.width * (9 / 16);
          if (targetH <= img.height) {
            startY = (img.height - targetH) / 2;
            cropHeight = targetH;
          } else {
            const targetW = img.height * (16 / 9);
            startX = (img.width - targetW) / 2;
            cropWidth = targetW;
          }
          targetWidth = Math.min(cropWidth, 1600);
          targetHeight = Math.round(targetWidth * (9 / 16));
        } else if (aspectRatio === '4:3') {
          const targetH = img.width * (3 / 4);
          if (targetH <= img.height) {
            startY = (img.height - targetH) / 2;
            cropHeight = targetH;
          } else {
            const targetW = img.height * (4 / 3);
            startX = (img.width - targetW) / 2;
            cropWidth = targetW;
          }
          targetWidth = Math.min(cropWidth, 1400);
          targetHeight = Math.round(targetWidth * (3 / 4));
        } else {
          // Free, cap max width to 1920
          if (targetWidth > 1920) {
            targetHeight = Math.round((1920 / targetWidth) * targetHeight);
            targetWidth = 1920;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight);
          // Compress to WebP or JPEG
          const outputFormat = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(outputFormat, quality);
          resolve(optimizedDataUrl);
        } else {
          resolve(sourceDataUrl);
        }
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  };

  // Parse external video link (e.g. YouTube)
  const parseVideoEmbed = (url: string) => {
    let embedUrl = url;
    let thumb = '';
    let platform: 'youtube' | 'vimeo' | 'otro' = 'otro';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } else if (url.includes('vimeo.com')) {
      platform = 'vimeo';
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      embedUrl = `https://player.vimeo.com/video/${id}`;
    }

    return { embedUrl, thumb, platform };
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'file' && !previewUrl && !rawFile) {
      setErrorMsg('Por favor seleccione o arrastre un archivo multimedia.');
      return;
    }

    if (activeTab === 'video-url' && !videoUrl.trim()) {
      setErrorMsg('Por favor ingrese el enlace del video (YouTube o Vimeo).');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('El título del archivo es obligatorio.');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(20);

    try {
      let finalUrl = previewUrl;
      let finalThumb = previewUrl;
      let isExternal = false;
      let platformResult: 'youtube' | 'vimeo' | 'otro' | undefined = undefined;

      if (activeTab === 'video-url') {
        const parsed = parseVideoEmbed(videoUrl);
        finalUrl = parsed.embedUrl;
        finalThumb = parsed.thumb || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600';
        isExternal = true;
        platformResult = parsed.platform;
        setFileType('video');
      } else if (fileType === 'image' && previewUrl.startsWith('data:image')) {
        setUploadProgress(50);
        finalUrl = await processImageCanvas(previewUrl);
        finalThumb = finalUrl;
      }

      setUploadProgress(80);

      const createdMedia = await api.uploadMedia({
        name: fileName || title,
        type: activeTab === 'video-url' ? 'video' : fileType,
        mimeType: activeTab === 'video-url' ? 'video/external' : mimeType,
        size: fileSize || 0,
        url: finalUrl,
        thumbnailUrl: finalThumb,
        category,
        title: title.trim(),
        description: description.trim(),
        altText: altText.trim() || title.trim(),
        isExternal,
        externalPlatform: platformResult,
      });

      setUploadProgress(100);
      onUploaded(createdMedia);
      onClose();
    } catch (err: any) {
      console.error('Error saving media:', err);
      setErrorMsg(err.message || 'Error al procesar y guardar el archivo multimedia.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-900 text-white flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-stone-900 dark:text-white">
                Subir Archivo Multimedia Institucional
              </h2>
              <p className="text-xs text-stone-500">
                Formatos: JPG, PNG, WEBP, GIF, BMP, TIFF, SVG, AVIF, Videos MP4/WEBM o enlaces YouTube
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 flex gap-2 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 text-xs font-semibold px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'file'
                ? 'border-red-900 text-red-900 dark:text-red-400 dark:border-red-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Subir Archivo Local (Fotografía/Video)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video-url')}
            className={`pb-2.5 text-xs font-semibold px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'video-url'
                ? 'border-red-900 text-red-900 dark:text-red-400 dark:border-red-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Enlace de Video (YouTube / Vimeo)</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2.5 text-xs text-red-900 dark:text-red-300">
              <AlertCircle className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'file' ? (
            <div className="space-y-4">
              {/* Drag and drop box */}
              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-red-800 dark:hover:border-red-600 rounded-2xl p-8 text-center cursor-pointer transition-all bg-stone-50 dark:bg-stone-800/40 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                    className="hidden"
                    accept="image/*,video/mp4,video/webm,video/quicktime,.pdf,.docx"
                  />
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Arrastra aquí tu fotografía o archivo multimedia
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    o haz clic para explorar en tu celular o computador
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-[10px] text-stone-400">
                    <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-700 rounded">JPG</span>
                    <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-700 rounded">PNG</span>
                    <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-700 rounded">WEBP</span>
                    <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-700 rounded">GIF</span>
                    <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-700 rounded">SVG</span>
                    <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-700 rounded">MP4</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File preview */}
                  <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center min-h-[220px] max-h-[340px]">
                    {fileType === 'image' ? (
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="max-h-[340px] w-auto object-contain"
                      />
                    ) : fileType === 'video' ? (
                      <video src={previewUrl} controls className="max-h-[340px] w-full" />
                    ) : (
                      <div className="p-8 text-center text-white">
                        <FileText className="w-16 h-16 mx-auto mb-2 text-red-400" />
                        <span className="text-sm font-mono">{fileName}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setRawFile(null);
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg transition-colors text-xs flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Cambiar archivo</span>
                    </button>
                  </div>

                  {/* Image Crop & Quality Controls */}
                  {fileType === 'image' && (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                        <span className="flex items-center gap-1.5">
                          <Crop className="w-4 h-4 text-red-800 dark:text-red-400" />
                          Proporción de Recorte
                        </span>
                        <div className="flex gap-1.5">
                          {(['free', '1:1', '16:9', '4:3'] as const).map((ratio) => (
                            <button
                              key={ratio}
                              type="button"
                              onClick={() => setAspectRatio(ratio)}
                              className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                                aspectRatio === ratio
                                  ? 'bg-red-900 text-white font-bold'
                                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                              }`}
                            >
                              {ratio === 'free' ? 'Libre' : ratio}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-700">
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-stone-500" />
                          Calidad de compresión ({Math.round(quality * 100)}%)
                        </span>
                        <input
                          type="range"
                          min="0.5"
                          max="1"
                          step="0.05"
                          value={quality}
                          onChange={(e) => setQuality(parseFloat(e.target.value))}
                          className="w-36 accent-red-900"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Video URL mode */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Enlace de YouTube o Vimeo
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Se generará automáticamente la vista previa y el reproductor responsivo integrado.
                </p>
              </div>

              {videoUrl.trim() && (
                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[11px] font-bold text-red-900 dark:text-red-400 block mb-2">
                    Vista previa de incrustación:
                  </span>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={parseVideoEmbed(videoUrl).embedUrl}
                      title="Video preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Título del archivo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Sesión Plenaria Ordinaria Agosto 2026"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none"
              >
                <option value="institucional">Institucional / Logotipos</option>
                <option value="eventos">Eventos y Asambleas</option>
                <option value="consejeros">Perfiles de Consejeros</option>
                <option value="territorio">Territorio y Paisajes Flandes</option>
                <option value="documentos">Documentos y Gacetas</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Texto Alternativo (Accesibilidad / Lectores de Pantalla)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe la imagen para personas con discapacidad visual"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Descripción Institucional (Opcional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contexto o detalles de la fotografía / video"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Progress bar */}
          {isProcessing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-stone-500 font-mono">
                <span>Procesando y guardando multimedia...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-900 dark:bg-red-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Guardar en Biblioteca</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
