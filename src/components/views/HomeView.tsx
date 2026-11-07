/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { NewsArticle, CouncilSession, PublicPoll, YouthProject, InstitutionalPartner, MediaItem } from '../../types';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import {
  Calendar,
  FileText,
  Users,
  Compass,
  Vote,
  Send,
  ArrowRight,
  Shield,
  MapPin,
  CheckCircle,
  ExternalLink,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Video,
  Play
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenArticle?: (article: NewsArticle) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenArticle }) => {
  const { settings } = useSiteSettings();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sessions, setSessions] = useState<CouncilSession[]>([]);
  const [polls, setPolls] = useState<PublicPoll[]>([]);
  const [partners, setPartners] = useState<InstitutionalPartner[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [pollVoted, setPollVoted] = useState<boolean>(false);
  const [votingLoading, setVotingLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    consejerosCount: 5,
    sessionsCount: 2,
    documentsCount: 4,
    projectsCount: 2,
    citizenProposalsCount: 2,
    totalPollVotes: 442,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, sessionsData, pollsData, partnersData, mediaData, statsData] = await Promise.all([
          api.getNews(),
          api.getSessions(),
          api.getPolls(),
          api.getPartners(),
          api.getMedia().catch(() => []),
          api.getPublicStats().catch(() => null),
        ]);
        setNews(newsData);
        setSessions(sessionsData);
        setPolls(pollsData);
        setPartners(partnersData);
        if (mediaData) setMediaList(mediaData);
        if (statsData) setStats(statsData);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };
    fetchData();
  }, []);

  const activePoll = polls.length > 0 ? polls[0] : null;

  const handleVote = async () => {
    if (!activePoll || !selectedOptionId) return;
    setVotingLoading(true);
    try {
      const res = await api.votePoll(activePoll.id, selectedOptionId);
      setPolls(prev => prev.map(p => (p.id === activePoll.id ? res.poll : p)));
      setPollVoted(true);
    } catch (err) {
      console.error('Error voting:', err);
    } finally {
      setVotingLoading(false);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white min-h-[540px] flex items-center">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroBannerUrl || "/src/assets/images/flandes_river_landscape_1793990334929.jpg"}
            alt={settings.heroTitle}
            className="w-full h-full object-cover object-center filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <div className="max-w-2xl space-y-6">
            {/* Clean Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wider uppercase font-sans">
              <span>{settings.municipality}, {settings.department}</span>
              <span aria-hidden="true">·</span>
              <span>{settings.heroBadge || 'Estatuto de Ciudadanía Juvenil'}</span>
              <span aria-hidden="true">·</span>
              <span>Periodo {settings.period}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight [text-wrap:balance]">
              {settings.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans font-light">
              {settings.heroSubtitle}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('participacion')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-800 hover:bg-red-900 rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Radicar Propuesta Ciudadana</span>
              </button>

              <button
                onClick={() => onNavigate('sesiones')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-100 bg-stone-800/80 hover:bg-stone-700/80 backdrop-blur-xs rounded-lg border border-stone-600 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Calendario de Sesiones</span>
              </button>

              <button
                onClick={() => onNavigate('documentos')}
                className="px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Consultar Actas</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Institutional Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200">
          <div className="border-r border-stone-100 dark:border-stone-800 pr-4">
            <div className="text-2xl font-bold font-sans text-red-900 dark:text-red-400 tabular-nums">
              {stats.consejerosCount}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Curules de Consejeros</div>
          </div>
          <div className="border-r border-stone-100 dark:border-stone-800 pr-4">
            <div className="text-2xl font-bold font-sans text-red-900 dark:text-red-400 tabular-nums">
              {stats.sessionsCount}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Sesiones Plenarias 2026</div>
          </div>
          <div className="border-r border-stone-100 dark:border-stone-800 pr-4">
            <div className="text-2xl font-bold font-sans text-red-900 dark:text-red-400 tabular-nums">
              {stats.documentsCount}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Documentos Públicos</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-sans text-red-900 dark:text-red-400 tabular-nums">
              {stats.citizenProposalsCount}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Iniciativas Ciudadanas</div>
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
            Acceso Rápido Ciudadano
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
            Servicios y Módulos de Información
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Consulta libre y transparente de las actuaciones, proyectos y representatividad de las juventudes de Flandes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('integrantes')}
            className="text-left p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-800 dark:hover:border-red-500 transition-all shadow-xs group"
          >
            <div className="p-3 w-fit rounded-lg bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-400 mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white mb-2">
              Directorio de Consejeros
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Conoce a los representantes juveniles electos por listas independientes, partidos y procesos organizativos en Flandes.
            </p>
            <span className="text-xs font-semibold text-red-900 dark:text-red-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Ver integrantes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onNavigate('documentos')}
            className="text-left p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-800 dark:hover:border-red-500 transition-all shadow-xs group"
          >
            <div className="p-3 w-fit rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white mb-2">
              Actas y Resoluciones
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Biblioteca documental oficial para consultar y verificar las actas de plenarias, resoluciones y reglamentos vigentes.
            </p>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Biblioteca documental</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onNavigate('proyectos')}
            className="text-left p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-800 dark:hover:border-red-500 transition-all shadow-xs group"
          >
            <div className="p-3 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white mb-2">
              Banco de Proyectos Juveniles
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Iniciativas de política pública, Casa de la Juventud, emprendimiento ribereño y transporte estudiantil formuladas para Flandes.
            </p>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Explorar proyectos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onNavigate('comisiones')}
            className="text-left p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-800 dark:hover:border-red-500 transition-all shadow-xs group"
          >
            <div className="p-3 w-fit rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white mb-2">
              Comisiones de Trabajo
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              5 mesas técnicas temáticas: Educación y Cultura, Medio Ambiente (Río Magdalena), Deporte y Salud, Emprendimiento y DDHH.
            </p>
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Ver comisiones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onNavigate('participacion')}
            className="text-left p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-800 dark:hover:border-red-500 transition-all shadow-xs group"
          >
            <div className="p-3 w-fit rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white mb-2">
              Buzón de Iniciativas Ciudadanas
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Radica peticiones, problemáticas de tu barrio o propuestas juveniles con número de seguimiento oficial del CMJ.
            </p>
            <span className="text-xs font-semibold text-purple-800 dark:text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Radicar iniciativa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onNavigate('transparencia')}
            className="text-left p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-800 dark:hover:border-red-500 transition-all shadow-xs group"
          >
            <div className="p-3 w-fit rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 mb-4 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white mb-2">
              Transparencia y Gestión
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Seguimiento al Plan de Trabajo Anual, rendición pública de cuentas semestral y cumplimiento de la Ley 1712 de 2014.
            </p>
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Rendición de cuentas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* Featured News Section (3-Tier Salience Pattern from Institutional Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
              Sala de Prensa Oficial
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
              Noticias y Comunicados Institucionales
            </h2>
          </div>
          <button
            onClick={() => onNavigate('noticias')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-red-900 dark:text-red-400 hover:underline"
          >
            <span>Ver todas las noticias</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {news.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Lead Story: 7 Columns */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <div>
                <div className="relative aspect-16/9 rounded-lg overflow-hidden mb-5">
                  <img
                    src={news[0].imageUrl}
                    alt={news[0].title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-red-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                    {news[0].category}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span>{new Date(news[0].publishedAt).toLocaleDateString('es-CO', { dateStyle: 'long' })}</span>
                  <span aria-hidden="true">·</span>
                  <span>{news[0].author}</span>
                </div>

                <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-white mb-3 [text-wrap:balance]">
                  {news[0].title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  {news[0].summary}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('noticias')}
                  className="text-xs font-semibold text-red-900 dark:text-red-400 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  <span>Leer comunicado completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-stone-400 font-sans">Oficial CMJ Flandes</span>
              </div>
            </div>

            {/* Secondary Stories: 5 Columns */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              {news.slice(1, 3).map(article => (
                <div
                  key={article.id}
                  className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
                      <span className="font-medium text-amber-700 dark:text-amber-400">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white mb-2 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3 mb-3">
                      {article.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate('noticias')}
                    className="text-xs font-semibold text-red-900 dark:text-red-400 flex items-center gap-1 hover:underline pt-2 border-t border-stone-100 dark:border-stone-800"
                  >
                    <span>Leer noticia</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Two-Column Split: Upcoming Sessions + Live Public Poll */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Calendario de Sesiones */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                    Sesiones Plenarias
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Convocatorias formales y órdenes del día
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('sesiones')}
                className="text-xs font-semibold text-red-900 dark:text-red-400 hover:underline"
              >
                Ver calendario
              </button>
            </div>

            <div className="space-y-4">
              {sessions.map(ses => (
                <div
                  key={ses.id}
                  className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-red-900 dark:text-red-400 font-sans">
                      {ses.sessionNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        ses.status === 'Programada'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {ses.status}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-white mb-2">
                    {ses.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 dark:text-stone-300 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{ses.date} · {ses.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{ses.location}</span>
                    </div>
                  </div>

                  {ses.orderOfDay && ses.orderOfDay.length > 0 && (
                    <div className="mt-2 text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900/60 p-2.5 rounded border border-stone-200/60 dark:border-stone-800">
                      <p className="font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Orden del día previsto:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {ses.orderOfDay.slice(0, 3).map((item, i) => (
                          <li key={i} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Live Public Poll */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400">
                <Vote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  Participación Ciudadana
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Encuesta de opinión juvenil
                </p>
              </div>
            </div>

            {activePoll ? (
              <div className="space-y-4">
                <div className="text-xs text-amber-800 dark:text-amber-400 font-semibold uppercase tracking-wider">
                  {activePoll.category}
                </div>
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white leading-snug">
                  {activePoll.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {activePoll.description}
                </p>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {activePoll.options.map(opt => {
                    const pct = activePoll.totalVotes > 0 ? Math.round((opt.votes / activePoll.totalVotes) * 100) : 0;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => !pollVoted && setSelectedOptionId(opt.id)}
                        className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                          selectedOptionId === opt.id
                            ? 'border-red-900 dark:border-red-500 bg-red-50/50 dark:bg-red-950/30 font-semibold'
                            : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="poll-option"
                              checked={selectedOptionId === opt.id}
                              onChange={() => setSelectedOptionId(opt.id)}
                              disabled={pollVoted}
                              className="text-red-900 focus:ring-red-900"
                            />
                            <span className="text-stone-800 dark:text-stone-200">{opt.text}</span>
                          </div>
                          <span className="font-mono font-semibold tabular-nums text-stone-600 dark:text-stone-400 shrink-0 ml-2">
                            {pct}% ({opt.votes})
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-800 dark:bg-red-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                    Total votos registrados: <strong>{activePoll.totalVotes}</strong>
                  </span>

                  {!pollVoted ? (
                    <button
                      onClick={handleVote}
                      disabled={!selectedOptionId || votingLoading}
                      className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {votingLoading ? 'Registrando...' : 'Emitir Voto'}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>¡Voto registrado!</span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500">No hay encuestas activas en este momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* Citizen Mailbox Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-red-900 via-stone-900 to-red-950 rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-sans">
              Tu voz cuenta en el CMJ Flandes
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">
              ¿Tienes una propuesta o problemática juvenil en tu barrio o vereda?
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
              Radica formalmente tu iniciativa ante el Consejo Municipal de Juventud. Cada petición recibe un código oficial de radicado (PQRSF) y es remitida a la comisión competente para ser debatida en sesión plenaria.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('participacion')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-red-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
              >
                Radicar Propuesta Ahora
              </button>
              <button
                onClick={() => onNavigate('participacion')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white border border-stone-400 hover:border-white rounded-lg transition-colors"
              >
                Consultar Estado de Radicado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Multimedia & Territorial Showcase */}
      {mediaList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
                Galería Territorial y Actividades
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-white mt-1">
                Flandes en Imágenes y Videos Oficiales
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Registro visual de las asambleas, sesiones, paisajes ribereños del Río Magdalena y eventos juveniles de nuestro municipio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaList.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => setPreviewMedia(item)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 dark:border-stone-800 cursor-pointer shadow-xs hover:shadow-lg transition-all"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-900/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold font-serif leading-tight mt-0.5 line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Preview Modal for Home */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <h4 className="text-sm font-bold font-serif text-stone-900 dark:text-white truncate">
                {previewMedia.title}
              </h4>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[480px] overflow-hidden">
              {previewMedia.type === 'image' ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.altText || previewMedia.title}
                  className="max-h-[480px] w-auto object-contain"
                />
              ) : previewMedia.isExternal ? (
                <iframe
                  src={previewMedia.url}
                  title={previewMedia.title}
                  className="w-full aspect-video"
                  allowFullScreen
                />
              ) : (
                <video src={previewMedia.url} controls className="max-h-[480px] w-full" />
              )}
            </div>
            {previewMedia.description && (
              <div className="p-4 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/50">
                <p>{previewMedia.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Institutional Allies Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold font-sans">
            Articulación Institucional
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white mt-1">
            Entidades Aliadas y Acompañamiento
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map(p => (
            <a
              key={p.id}
              href={p.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-400 transition-all text-center flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-2">
                  {p.category}
                </span>
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white group-hover:text-red-900 dark:group-hover:text-red-400 transition-colors">
                  {p.logoText}
                </h4>
              </div>
              <div className="mt-4 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-1 text-[11px] text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-200">
                <span>Sitio oficial</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
