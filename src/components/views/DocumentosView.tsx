/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DocumentItem } from '../../types';
import {
  FileText,
  Search,
  Download,
  Eye,
  Printer,
  X,
  ShieldCheck,
  Calendar,
  Layers,
  FileCheck,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DocumentosView: React.FC = () => {
  const { user } = useAuth();
  const isMainAdmin = user?.role === 'admin' || user?.role === 'presidente' || user?.role === 'vicepresidente' || user?.email?.toLowerCase() === 'trujillogordilooo@gmail.com';
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('¿Confirma que desea eliminar este documento / acta oficial del archivo?')) return;
    try {
      await api.deleteDocument(id);
      loadDocuments();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar documento');
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [selectedCategory]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments(selectedCategory);
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Todas',
    'Acta de Sesión',
    'Resolución',
    'Convocatoria',
    'Reglamento',
    'Informe de Gestión',
  ];

  const filteredDocs = documents.filter(doc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.radicadoNumber.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query)
    );
  });

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Gaceta y Archivo Público
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Actas y Biblioteca Documental Oficial
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Repositorio público de actas de plenaria, resoluciones, convocatorias, informes de rendición de cuentas y reglamentos del Consejo Municipal de Juventud de Flandes.
        </p>
      </div>

      {/* Controls: Search and Category Tabs */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, radicado o palabra clave..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900 dark:focus:ring-red-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-900 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="py-20 text-center text-sm text-stone-500">
          Cargando documentos institucionales...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-16 text-center p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
          <FileText className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
            Archivo Documental en Proceso de Custodia
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            La Secretaría General publicará las actas de plenaria, resoluciones y acuerdos tan pronto sean firmados conforme a la normativa de transparencia y archivo público.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between hover:border-red-900/50 dark:hover:border-red-500/50 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-red-900 dark:text-red-400">
                    {doc.radicadoNumber}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {doc.category}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white leading-snug mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3 mb-4">
                  {doc.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{doc.date}</span>
                  </span>
                  <span>·</span>
                  <span>{doc.pagesCount} páginas</span>
                  <span>·</span>
                  <span>{doc.fileSize}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Estado: {doc.status}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-red-900 dark:text-red-300 hover:text-white hover:bg-red-900 dark:hover:bg-red-800 rounded-lg transition-colors border border-red-900/30 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Abrir Documento</span>
                  </button>
                  {isMainAdmin && (
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors border border-stone-200 dark:border-stone-800"
                      title="Eliminar documento del archivo público"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Reader / Print Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
            {/* Modal Actions Bar (No-Print) */}
            <div className="no-print bg-stone-100 dark:bg-stone-800 px-6 py-3.5 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-900 dark:text-red-400" />
                <span className="text-xs font-bold font-mono text-stone-900 dark:text-white">
                  {previewDoc.radicadoNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDocument}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5 border border-stone-300 dark:border-stone-600"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content Paper with Institutional Letterhead */}
            <div className="overflow-y-auto p-8 sm:p-12 space-y-8 bg-white text-stone-900 font-sans">
              {/* Institutional Letterhead */}
              <div className="text-center pb-6 border-b-2 border-stone-900 space-y-1">
                <p className="text-[11px] uppercase tracking-widest font-bold text-stone-600">
                  REPÚBLICA DE COLOMBIA · DEPARTAMENTO DEL TOLIMA
                </p>
                <h2 className="font-serif font-bold text-xl text-stone-950 uppercase tracking-tight">
                  CONSEJO MUNICIPAL DE JUVENTUD DE FLANDES
                </h2>
                <p className="text-xs text-stone-600 font-medium">
                  SECRETARÍA GENERAL · ARCHIVO INSTITUCIONAL Y GACETA PÚBLICA
                </p>
                <div className="pt-2 text-xs font-mono font-bold text-red-900">
                  RADICADO OFICIAL: {previewDoc.radicadoNumber}
                </div>
              </div>

              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 block">Tipo:</span>
                  <span className="font-semibold">{previewDoc.category}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Fecha de Expedición:</span>
                  <span className="font-semibold">{previewDoc.date}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Extensión:</span>
                  <span className="font-semibold">{previewDoc.pagesCount} folios ({previewDoc.fileSize})</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Validez:</span>
                  <span className="font-semibold text-emerald-800">{previewDoc.status}</span>
                </div>
              </div>

              {/* Document Title & Body Text */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-stone-950 leading-snug">
                  {previewDoc.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line text-justify font-serif">
                  {previewDoc.description}
                </p>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded text-xs space-y-2 font-mono">
                  <div className="font-bold text-stone-700">CONSTANCIA INSTITUCIONAL DE PUBLICIDAD:</div>
                  <p className="text-stone-600">
                    El presente acto se expide de conformidad con los artículos 40 y siguientes de la Ley Estatutaria 1622 de 2013 y la Ley 1885 de 2018 (Estatuto de Ciudadanía Juvenil). El original reposa debidamente foliado en los libros de la Secretaría General del Consejo Municipal de Juventud de Flandes (Tolima).
                  </p>
                </div>
              </div>

              {/* Signatures Block */}
              <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-1">
                  <div className="border-t border-stone-800 w-48 mx-auto mb-1" />
                  <p className="font-bold">Presidencia del CMJ</p>
                  <p className="text-stone-500">Consejo Municipal de Juventud</p>
                  <p className="text-[10px] text-stone-400">Flandes, Tolima</p>
                </div>
                <div className="space-y-1">
                  <div className="border-t border-stone-800 w-48 mx-auto mb-1" />
                  <p className="font-bold">Secretaría General del CMJ</p>
                  <p className="text-stone-500">Custodia y Archivo Documental</p>
                  <p className="text-[10px] text-stone-400">Flandes, Tolima</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
