/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ConsejeroProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Mail,
  Phone,
  Shield,
  FileCheck,
  CheckCircle,
  X,
  ExternalLink,
  Edit,
  UserCheck,
  Layers,
  Sparkles,
  Flag,
  Landmark
} from 'lucide-react';

interface IntegrantesViewProps {
  onNavigateToAdmin?: () => void;
  onOpenRegister?: () => void;
}

export const IntegrantesView: React.FC<IntegrantesViewProps> = ({ onNavigateToAdmin, onOpenRegister }) => {
  const { user } = useAuth();
  const [consejeros, setConsejeros] = useState<ConsejeroProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectorFilter, setSectorFilter] = useState<string>('Todos');
  const [selectedConsejero, setSelectedConsejero] = useState<ConsejeroProfile | null>(null);

  useEffect(() => {
    loadConsejeros();
  }, []);

  const loadConsejeros = async () => {
    setLoading(true);
    try {
      const data = await api.getConsejeros();
      setConsejeros(data);
    } catch (err) {
      console.error('Error fetching consejeros:', err);
    } finally {
      setLoading(false);
    }
  };

  const sectors = [
    'Todos',
    'Mesa Directiva',
    'Listas Independientes',
    'Partidos y Movimientos Políticos',
    'Procesos y Prácticas Organizativas',
    'Comunidades Campesinas y Étnicas',
  ];

  const filteredConsejeros = consejeros.filter(c => {
    if (sectorFilter === 'Todos') return true;
    if (sectorFilter === 'Mesa Directiva') return c.isMesaDirectiva;
    return c.representationSector === sectorFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
            Directorio Institucional
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white mt-1">
            Integrantes del Consejo de Juventud
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-2xl">
            Perfiles individuales de los consejeros municipales de juventud de Flandes (Periodo 2024-2026), elegidos conforme al Estatuto de Ciudadanía Juvenil.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 text-xs font-semibold text-red-900 dark:text-red-300 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 rounded-lg border border-red-200 dark:border-red-800 transition-colors flex items-center gap-2 shrink-0"
            >
              <UserCheck className="w-4 h-4 text-red-700 dark:text-red-400" />
              <span>Registrarme como Consejero(a)</span>
            </button>
          )}

          {user && (user.role === 'admin' || user.role === 'presidente') && onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-2 shrink-0"
            >
              <Edit className="w-4 h-4" />
              <span>Gestionar Perfiles (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Filter Tabs (Strictly Functional Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sectors.map(sec => (
          <button
            key={sec}
            onClick={() => setSectorFilter(sec)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              sectorFilter === sec
                ? 'bg-red-900 text-white font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Grid of Consejeros */}
      {loading ? (
        <div className="py-20 text-center text-sm text-stone-500">
          Cargando directorio de consejeros...
        </div>
      ) : filteredConsejeros.length === 0 ? (
        <div className="py-16 text-center p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
          <p className="text-sm text-stone-500">No se encontraron perfiles en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsejeros.map(c => (
            <div
              key={c.id}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:border-red-800 dark:hover:border-red-600 transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                {/* Photo or Styled Heraldic Placeholder */}
                <div className="flex items-start justify-between gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                    {c.photoUrl ? (
                      <img
                        src={c.photoUrl}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 dark:text-stone-500 p-2 text-center">
                        <Users className="w-8 h-8 opacity-40 mb-1" />
                        <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-stone-400">
                          Curul
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    {c.isMesaDirectiva && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                        Mesa Directiva
                      </span>
                    )}
                    <span className="block text-[11px] text-stone-400 mt-1 font-mono">
                      {c.period}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white leading-snug">
                    {c.name}
                  </h3>
                  <p className="text-xs font-semibold text-red-900 dark:text-red-400 font-sans mt-0.5">
                    {c.roleTitle}
                  </p>
                  {/* Partido o Movimiento Político */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                    <Flag className="w-3 h-3 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span className="truncate max-w-[210px]">{c.partyOrOrgName || 'Lista Independiente / Proceso Juvenil'}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-medium text-stone-800 dark:text-stone-200 truncate">{c.partyOrOrgName || 'Lista Independiente'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{c.representationSector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{c.commissionName}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-3 leading-relaxed">
                  {c.bio}
                </p>
              </div>

              {/* Card Footer Button */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => setSelectedConsejero(c)}
                  className="w-full py-2 px-3 text-xs font-semibold text-red-900 dark:text-red-300 hover:text-white hover:bg-red-900 dark:hover:bg-red-800 rounded-lg transition-colors border border-red-900/30 dark:border-red-400/30 text-center"
                >
                  Ver Perfil Institucional Completo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Individual Consejero Profile Modal */}
      {selectedConsejero && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-red-900 dark:text-red-400 font-bold font-sans">
                  Perfil Oficial del Consejero
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  {selectedConsejero.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedConsejero(null)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Profile Overview */}
              <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-stone-100 dark:border-stone-800">
                <div className="w-24 h-24 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {selectedConsejero.photoUrl ? (
                    <img
                      src={selectedConsejero.photoUrl}
                      alt={selectedConsejero.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-10 h-10 text-stone-400 opacity-60" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-900 dark:text-red-400">
                      {selectedConsejero.roleTitle}
                    </span>
                    {selectedConsejero.isMesaDirectiva && (
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                        Mesa Directiva
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
                    {selectedConsejero.name}
                  </h4>
                  {/* Partido Político destacado */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
                      <Flag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>Partido o Movimiento: {selectedConsejero.partyOrOrgName || 'Lista Independiente / Proceso Juvenil'}</span>
                    </div>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Sector: {selectedConsejero.representationSector}
                    </span>
                  </div>
                  <div className="pt-2 text-xs text-stone-600 dark:text-stone-300 flex flex-wrap gap-4">
                    {selectedConsejero.contactEmail && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span>{selectedConsejero.contactEmail}</span>
                      </div>
                    )}
                    {selectedConsejero.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{selectedConsejero.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Biografía */}
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                  Biografía y Perfil de Representación
                </h5>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                  {selectedConsejero.bio}
                </p>
              </div>

              {/* Comisión Asignada */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Comisión Temática
                </span>
                <p className="text-xs font-semibold text-stone-900 dark:text-white">
                  {selectedConsejero.commissionName}
                </p>
              </div>

              {/* Funciones */}
              {selectedConsejero.functions && selectedConsejero.functions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    Funciones Institucionales
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {selectedConsejero.functions.map((fn, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-red-800 dark:text-red-400 shrink-0 mt-0.5" />
                        <span>{fn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Propuestas e Iniciativas */}
              {selectedConsejero.initiatives && selectedConsejero.initiatives.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    Propuestas e Iniciativas en Curso
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {selectedConsejero.initiatives.map((init, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span>{init}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Proyectos Vinculados */}
              {selectedConsejero.projects && selectedConsejero.projects.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    Proyectos Acompañados
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedConsejero.projects.map((proj, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setSelectedConsejero(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
              >
                Cerrar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
