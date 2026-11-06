/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Building,
  TreePine,
  Trophy,
  GraduationCap,
  Navigation,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';

export interface MapPoint {
  id: string;
  name: string;
  category: 'Institucional' | 'Cultura y Patrimonio' | 'Deporte' | 'Educación' | 'Sector Rural';
  address: string;
  lat: number;
  lng: number;
  description: string;
  importanceToYouth: string;
}

const FLANDES_POINTS: MapPoint[] = [
  {
    id: 'pt-palacio',
    name: 'Palacio Municipal de Flandes (Recinto CMJ)',
    category: 'Institucional',
    address: 'Carrera 8 con Calle 9, Frente al Parque Principal',
    lat: 4.2882,
    lng: -74.8152,
    description: 'Sede administrativa municipal y recinto donde sesiona formalmente el Consejo Municipal de Juventud.',
    importanceToYouth: 'Lugar de radicación de peticiones ciudadanas, audiencias públicas y mesas de concertación con el Alcalde.',
  },
  {
    id: 'pt-cultura',
    name: 'Casa de la Cultura de Flandes',
    category: 'Cultura y Patrimonio',
    address: 'Calle 10 con Carrera 7',
    lat: 4.2891,
    lng: -74.8138,
    description: 'Centro de formación artística, danzas folclóricas tolimenses y biblioteca municipal.',
    importanceToYouth: 'Espacio de ensayos para grupos juveniles, teatro y talleres de memoria ribereña.',
  },
  {
    id: 'pt-puente',
    name: 'Malecón del Río Magdalena y Puente Férreo',
    category: 'Cultura y Patrimonio',
    address: 'Sector Ribereño Flandes - Girardot',
    lat: 4.2925,
    lng: -74.8078,
    description: 'Emblemático puente ferroviario y ribera del Río Magdalena que conecta Flandes con Girardot.',
    importanceToYouth: 'Escenario de jornadas ambientales de reforestación joven y actividades turísticas.',
  },
  {
    id: 'pt-rosas',
    name: 'Polideportivo Comunitario Barrio Las Rosas',
    category: 'Deporte',
    address: 'Barrio Las Rosas, Flandes',
    lat: 4.2835,
    lng: -74.8190,
    description: 'Escenario deportivo múltiple para fútbol de salón, baloncesto y voleibol.',
    importanceToYouth: 'Sede de torneos relámpago juveniles por la paz y prevención social.',
  },
  {
    id: 'pt-colegio',
    name: 'Institución Educativa Manuela Beltrán',
    category: 'Educación',
    address: 'Barrio Alfonso López, Flandes',
    lat: 4.2860,
    lng: -74.8165,
    description: 'Principal colegio público del municipio con amplia población estudiantil juvenil.',
    importanceToYouth: 'Sede de foros de liderazgo estudiantil, gobierno escolar y veeduría juvenil.',
  },
  {
    id: 'pt-paradero',
    name: 'Caseta Comunal Vereda Paradero',
    category: 'Sector Rural',
    address: 'Corredor Veredal Sur, Flandes',
    lat: 4.2690,
    lng: -74.8250,
    description: 'Punto de encuentro de las juventudes campesinas del sector rural flamenco.',
    importanceToYouth: 'Mesas de diálogo veredal para la conectividad y proyectos productivos agropecuarios.',
  },
  {
    id: 'pt-topacio',
    name: 'Sector Rural Vereda Topacio',
    category: 'Sector Rural',
    address: 'Vereda Topacio, Flandes',
    lat: 4.2580,
    lng: -74.8320,
    description: 'Zona rural productiva del municipio de Flandes.',
    importanceToYouth: 'Acompañamiento a jóvenes emprendedores rurales y conservación ecológica.',
  },
];

// Helper sub-component to pan the map programmatically
const MapPanController: React.FC<{ target: { lat: number; lng: number } | null }> = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (map && target) {
      map.panTo(target);
      map.setZoom(15);
    }
  }, [map, target]);
  return null;
};

interface FlandesTerritorialMapProps {
  apiKey?: string;
  selectedPointId?: string;
  onSelectPoint?: (point: MapPoint) => void;
}

export const FlandesTerritorialMap: React.FC<FlandesTerritorialMapProps> = ({
  apiKey,
  selectedPointId,
  onSelectPoint,
}) => {
  const mapsApiKey = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number } | null>(null);

  const categories = ['Todos', 'Institucional', 'Cultura y Patrimonio', 'Deporte', 'Educación', 'Sector Rural'];

  const filteredPoints = FLANDES_POINTS.filter(pt => {
    if (selectedCategory === 'Todos') return true;
    return pt.category === selectedCategory;
  });

  const handlePointClick = (pt: MapPoint) => {
    setActivePoint(pt);
    setPanTarget({ lat: pt.lat, lng: pt.lng });
    if (onSelectPoint) onSelectPoint(pt);
  };

  const getPinColor = (category: string) => {
    switch (category) {
      case 'Institucional':
        return '#881313'; // Vinotinto Tolima
      case 'Cultura y Patrimonio':
        return '#b45309'; // Oro cálido
      case 'Deporte':
        return '#15803d'; // Verde
      case 'Educación':
        return '#1d4ed8'; // Azul
      case 'Sector Rural':
        return '#047857'; // Esmeralda rural
      default:
        return '#881313';
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-red-900 dark:text-red-400 font-sans">
            <Navigation className="w-4 h-4" />
            <span>Cartografía y Presencia Territorial</span>
          </div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-white mt-1">
            Mapa Interactivo de Flandes y Puntos Clave del CMJ
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Explora las sedes institucionales, escenarios culturales, polideportivos y sectores rurales donde sesiona e incide el Consejo.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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

      {/* Main Map Viewport & Places Sidebar Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Map Box: 8 Cols (Explicit Height strictly enforced per CF2) */}
        <div className="lg:col-span-8 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-inner relative min-h-[420px] sm:min-h-[460px]">
          {mapsApiKey ? (
            <APIProvider apiKey={mapsApiKey}>
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={{ lat: 4.2882, lng: -74.8152 }}
                defaultZoom={14}
                gestureHandling="cooperative"
                disableDefaultUI={false}
                className="w-full h-full min-h-[420px] sm:min-h-[460px]"
              >
                <MapPanController target={panTarget} />

                {filteredPoints.map(point => (
                  <AdvancedMarker
                    key={point.id}
                    position={{ lat: point.lat, lng: point.lng }}
                    onClick={() => handlePointClick(point)}
                    title={point.name}
                  >
                    <div
                      className="p-1.5 rounded-full shadow-md text-white transition-transform hover:scale-115 flex items-center justify-center cursor-pointer border-2 border-white"
                      style={{ backgroundColor: getPinColor(point.category) }}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                  </AdvancedMarker>
                ))}

                {activePoint && (
                  <InfoWindow
                    position={{ lat: activePoint.lat, lng: activePoint.lng }}
                    onCloseClick={() => setActivePoint(null)}
                  >
                    <div className="p-2 max-w-xs space-y-1.5 text-stone-900 font-sans">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: getPinColor(activePoint.category) }}
                      >
                        {activePoint.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm leading-tight text-stone-950">
                        {activePoint.name}
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        {activePoint.address}
                      </p>
                      <p className="text-[11px] text-stone-700 leading-snug pt-1 border-t border-stone-200">
                        {activePoint.description}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-500 p-6 text-center space-y-3">
              <MapPin className="w-10 h-10 text-red-900/60" />
              <p className="text-sm font-semibold">Configuración de Google Maps Platform</p>
              <p className="text-xs max-w-md text-stone-400">
                La clave de API de Google Maps está inicializándose en el entorno.
              </p>
            </div>
          )}
        </div>

        {/* Places List & Selector: 4 Cols */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3 max-h-[460px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Puntos Georreferenciados ({filteredPoints.length})
          </div>

          <div className="space-y-2.5">
            {filteredPoints.map(point => {
              const isSelected = activePoint?.id === point.id;
              return (
                <div
                  key={point.id}
                  onClick={() => handlePointClick(point)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-red-900 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20 font-semibold shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="p-1.5 rounded-lg text-white shrink-0 mt-0.5"
                      style={{ backgroundColor: getPinColor(point.category) }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="font-serif font-bold text-xs text-stone-900 dark:text-white leading-tight">
                        {point.name}
                      </h5>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {point.address}
                      </p>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 pt-1">
                        {point.importanceToYouth}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
