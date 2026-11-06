/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { NewsArticle } from '../../types';
import { Search, Calendar, User, ArrowRight, X, Share2, Tag } from 'lucide-react';

export const NoticiasView: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Todas', 'Institucional', 'Convocatoria', 'Sesiones', 'Cultura y Deporte', 'Participación'];

  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'Todas' || art.category === selectedCategory;
    if (!matchesCat) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return art.title.toLowerCase().includes(q) || art.summary.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Sala de Prensa Institucional
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Noticias y Actualidad del CMJ Flandes
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Información oficial sobre plenarias, acuerdos de concertación, mesas ambientales en el Río Magdalena, actividades culturales y pronunciamientos del Consejo Municipal de Juventud.
        </p>
      </div>

      {/* Controls: Search & Category */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar noticias o comunicados..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900 shadow-2xs"
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

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-stone-500">Cargando noticias...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-16 text-center p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
          <h3 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
            Sala de Prensa en Preparación
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Los boletines de prensa, declaraciones y novedades del Consejo Municipal de Juventud de Flandes se publicarán en este espacio una vez sean emitidos formalmente por la Mesa Directiva.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:border-red-900/40 dark:hover:border-red-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-red-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-sans">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(article.publishedAt).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
                    </span>
                    <span>·</span>
                    <span className="truncate">{article.author}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setReadingArticle(article)}
                  className="w-full py-2 px-3 text-xs font-semibold text-red-900 dark:text-red-400 hover:text-white hover:bg-red-900 dark:hover:bg-red-800 rounded-lg transition-colors border border-red-900/30 text-center flex items-center justify-center gap-1.5"
                >
                  <span>Leer Comunicado Completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-900 dark:text-red-400 font-sans">
                {readingArticle.category}
              </span>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <div className="space-y-3">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-white leading-tight">
                  {readingArticle.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span>{new Date(readingArticle.publishedAt).toLocaleDateString('es-CO', { dateStyle: 'long' })}</span>
                  <span aria-hidden="true">·</span>
                  <span>Por: <strong>{readingArticle.author}</strong></span>
                </div>
              </div>

              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={readingArticle.imageUrl}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Lead Summary */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border-l-2 border-red-900 dark:border-red-500 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed font-serif italic">
                {readingArticle.summary}
              </div>

              {/* Full Content */}
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {readingArticle.content}
              </div>

              {/* Tags */}
              {readingArticle.tags && readingArticle.tags.length > 0 && (
                <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  {readingArticle.tags.map((tg, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
              >
                Cerrar Noticia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
