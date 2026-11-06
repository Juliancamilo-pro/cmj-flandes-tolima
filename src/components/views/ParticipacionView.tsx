/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { api } from '../../services/api';
import { CitizenProposal } from '../../types';
import {
  Send,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Shield,
  HelpCircle
} from 'lucide-react';

export const ParticipacionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radicar' | 'consultar'>('radicar');

  // Form State
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(18);
  const [neighborhoodOrVereda, setNeighborhoodOrVereda] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Educación');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    code: string;
    proposal: CitizenProposal;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tracking State
  const [searchCode, setSearchCode] = useState('');
  const [trackedProposal, setTrackedProposal] = useState<CitizenProposal | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const neighborhoods = [
    'Barrio Centro',
    'Barrio Triana',
    'Barrio Iqueima',
    'Barrio Las Rosas',
    'Barrio Alfonso López',
    'Barrio San Luis',
    'Barrio La Capilla',
    'Barrio Gaitán',
    'Barrio Villa del Río',
    'Vereda Paradero',
    'Vereda Colegio',
    'Vereda Topacio',
    'Vereda Camala',
    'Otro sector de Flandes',
  ];

  const topics = [
    'Educación',
    'Medio Ambiente',
    'Salud y Deporte',
    'Cultura',
    'Emprendimiento',
    'Seguridad y DDHH',
    'Infraestructura Juvenil',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await api.submitCitizenProposal({
        fullName,
        age: Number(age),
        neighborhoodOrVereda,
        email,
        phone,
        topic,
        title,
        description,
      });

      setSubmissionSuccess({
        code: res.radicadoCode,
        proposal: res.proposal,
      });

      // Clear Form
      setFullName('');
      setTitle('');
      setDescription('');
      setNeighborhoodOrVereda('');
      setEmail('');
      setPhone('');
    } catch (err: any) {
      setSubmitError(err.message || 'Error al radicar la propuesta. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setTrackingLoading(true);
    setTrackingError(null);
    setTrackedProposal(null);

    try {
      const found = await api.trackCitizenProposal(searchCode.trim());
      setTrackedProposal(found);
    } catch (err: any) {
      setTrackingError(err.message || 'No se encontró ninguna petición radicada con ese código.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
          Buzón Ciudadano y Veeduría
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white [text-wrap:balance]">
          Participación Juvenil Flandes
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          Radica formalmente tus propuestas, problemáticas barriales, proyectos juveniles o peticiones ante el Consejo Municipal de Juventud. Cada solicitud recibe un número de radicado legal para su debido seguimiento.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('radicar')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'radicar'
              ? 'bg-red-900 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Radicar Nueva Propuesta / Petición</span>
        </button>

        <button
          onClick={() => setActiveTab('consultar')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'consultar'
              ? 'bg-red-900 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Consultar Estado de Radicado</span>
        </button>
      </div>

      {/* Tab 1: Radicar Form */}
      {activeTab === 'radicar' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xs space-y-6">
          {submissionSuccess ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-2xl text-emerald-950 dark:text-emerald-100">
                ¡Propuesta Radicada con Éxito!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 max-w-lg mx-auto leading-relaxed">
                Tu solicitud ha sido incorporada oficialmente en el libro de correspondencia del Consejo Municipal de Juventud de Flandes.
              </p>
              <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-emerald-300 dark:border-emerald-700 max-w-sm mx-auto">
                <span className="text-[11px] text-stone-500 uppercase font-sans font-bold block mb-1">
                  Tu Código de Radicado Oficial:
                </span>
                <span className="text-xl font-mono font-bold text-red-900 dark:text-red-400 select-all">
                  {submissionSuccess.code}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Guarda este código para hacerle seguimiento en la pestaña &quot;Consultar Estado de Radicado&quot;.
              </p>
              <button
                onClick={() => setSubmissionSuccess(null)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors"
              >
                Radicar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Nombre Completo del Joven Proponente *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Ej. Juan David Gómez"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Edad (Rango legal 14 a 28 años) *
                  </label>
                  <input
                    type="number"
                    required
                    min={14}
                    max={28}
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Barrio o Vereda de Flandes *
                  </label>
                  <select
                    required
                    value={neighborhoodOrVereda}
                    onChange={e => setNeighborhoodOrVereda(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  >
                    <option value="">Seleccione su sector...</option>
                    {neighborhoods.map(nb => (
                      <option key={nb} value={nb}>{nb}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Correo Electrónico de Contacto *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Teléfono Celular
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="310 123 4567"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Eje Temático de la Propuesta *
                </label>
                <div className="flex flex-wrap gap-2">
                  {topics.map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        topic === t
                          ? 'bg-red-900 text-white font-semibold'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Título Breve de la Iniciativa o Petición *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ej. Solicitud de iluminación y dotación deportiva en la cancha del Barrio Triana"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Descripción Detallada y Propuesta de Solución *
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explica detalladamente la problemática o propuesta: ¿A quiénes afecta? ¿Qué solución planteas? ¿Qué esperas que haga el Consejo de Juventud ante la Alcaldía de Flandes?"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-[11px] text-stone-400">
                  Sus datos serán tratados conforme a la Ley 1581 de 2012 de Protección de Datos Personales.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Radicando...' : 'Radicar Petición Oficial'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Track Form */}
      {activeTab === 'consultar' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xs space-y-6">
          <form onSubmit={handleTrack} className="space-y-4 max-w-xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
              Consulta de Estado por Número de Radicado
            </h3>
            <p className="text-xs text-stone-500">
              Ingresa el código oficial generado al radicar (ej. <strong>CMJ-FL-2026-0012</strong>):
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={searchCode}
                onChange={e => setSearchCode(e.target.value)}
                placeholder="CMJ-FL-2026-XXXX"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm uppercase font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>{trackingLoading ? 'Buscando...' : 'Consultar'}</span>
              </button>
            </div>
          </form>

          {trackingError && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
              {trackingError}
            </div>
          )}

          {trackedProposal && (
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200 dark:border-stone-700">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    Radicado Oficial
                  </span>
                  <span className="text-lg font-mono font-bold text-red-900 dark:text-red-400">
                    {trackedProposal.radicadoCode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                    {trackedProposal.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-500 uppercase">Título:</span>
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white mt-0.5">
                  {trackedProposal.title}
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-600 dark:text-stone-300">
                <div>
                  <span className="text-stone-400 block">Proponente:</span>
                  <span className="font-semibold">{trackedProposal.fullName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Sector / Barrio:</span>
                  <span className="font-semibold">{trackedProposal.neighborhoodOrVereda}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Fecha de Radicación:</span>
                  <span className="font-semibold">{new Date(trackedProposal.createdAt).toLocaleDateString('es-CO')}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                <span className="text-stone-400 block">Descripción:</span>
                <p className="leading-relaxed bg-white dark:bg-stone-900 p-3 rounded-lg border border-stone-200 dark:border-stone-800">
                  {trackedProposal.description}
                </p>
              </div>

              {trackedProposal.officialResponse ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Respuesta Oficial del Consejo Municipal de Juventud:</span>
                  </div>
                  <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
                    {trackedProposal.officialResponse}
                  </p>
                  {trackedProposal.responseDate && (
                    <span className="text-[10px] text-stone-400 block font-mono">
                      Fecha de respuesta: {new Date(trackedProposal.responseDate).toLocaleDateString('es-CO')}
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs text-stone-500 italic">
                  Esta petición se encuentra en etapa de estudio por la comisión correspondiente. La respuesta oficial será publicada en este panel.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
