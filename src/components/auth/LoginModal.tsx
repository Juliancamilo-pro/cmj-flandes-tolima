/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  ShieldAlert,
  KeyRound,
  UserCheck,
  Building2,
  FileText,
  Camera,
  Share2,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, registerWithCode } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form
  const [regCode, setRegCode] = useState('cmj-flandes');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regParty, setRegParty] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regPhotoUrl, setRegPhotoUrl] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regFacebook, setRegFacebook] = useState('');
  const [regCommission, setRegCommission] = useState('com_01');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (regCode.trim().toLowerCase() !== 'cmj-flandes') {
      setError('El código institucional es incorrecto. Debe ingresar exactamente "cmj-flandes".');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (regPassword.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerWithCode({
        name: regName,
        email: regEmail,
        password: regPassword,
        code: regCode,
        politicalParty: regParty,
        bio: regBio,
        photoUrl: regPhotoUrl,
        phone: regPhone,
        commissionId: regCommission,
        socialLinks: {
          instagram: regInstagram,
          facebook: regFacebook,
        },
      });

      setSuccessMsg(res.message || '¡Cuenta de consejero creada exitosamente!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al registrar la cuenta de consejero.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 overflow-hidden">
        {/* Top Header Accent with Colombian Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="h-full w-1/2 bg-[#FCD116]" />
          <div className="h-full w-1/4 bg-[#003893]" />
          <div className="h-full w-1/4 bg-[#CE1126]" />
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                Consejo Municipal de Juventud Flandes
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Acceso oficial y acreditación de consejeros
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mt-4 border-b border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-red-900 dark:border-red-500 text-red-900 dark:text-red-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-red-900 dark:border-red-500 text-red-900 dark:text-red-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Registrarme con Código (cmj-flandes)
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Iniciar Sesión */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="trujillogordilooo@gmail.com o correo registrado"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900 dark:focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(p => !p)}
                  className="text-[11px] text-stone-500 hover:text-red-900 dark:hover:text-red-400"
                >
                  {showLoginPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900 dark:focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 text-sm font-semibold text-white bg-red-900 hover:bg-red-950 dark:bg-red-800 dark:hover:bg-red-900 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-2">⏳</span>
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>Ingresar al Portal Institucional</span>
            </button>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">¿Eres consejero(a) electo(a)?</span>
                <p className="mt-0.5">
                  Puedes crear tu cuenta tú mismo(a) en la pestaña superior usando el código institucional <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded font-bold font-mono">cmj-flandes</code>.
                </p>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Registro con Código (Consejeros) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {/* Institutional Secret Code */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl">
              <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                Código de Registro Institucional *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regCode}
                  onChange={e => setRegCode(e.target.value)}
                  placeholder="cmj-flandes"
                  className="w-full px-3 py-1.5 text-sm font-mono font-bold tracking-wider rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-1">
                Código oficial de acreditación: <span className="font-bold font-mono">cmj-flandes</span>
              </p>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Ej. Andrés Camilo Rojas"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={regPasswordConfirm}
                  onChange={e => setRegPasswordConfirm(e.target.value)}
                  placeholder="Repetir contraseña"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
            </div>

            {/* Political Party / Organization & Commission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Partido, Movimiento o Lista *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={regParty}
                    onChange={e => setRegParty(e.target.value)}
                    placeholder="Ej. Juventudes Independientes"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Comisión de Trabajo
                </label>
                <select
                  value={regCommission}
                  onChange={e => setRegCommission(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                >
                  <option value="com_01">Educación, Ciencia y Cultura</option>
                  <option value="com_02">Medio Ambiente y Río Magdalena</option>
                  <option value="com_03">Salud Integral y Deporte</option>
                  <option value="com_04">Emprendimiento y Empleo</option>
                  <option value="com_05">Derechos Humanos y Paz</option>
                </select>
              </div>
            </div>

            {/* Biography */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Biografía y Trayectoria Juvenil
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <textarea
                  rows={2}
                  value={regBio}
                  onChange={e => setRegBio(e.target.value)}
                  placeholder="Cuéntanos sobre tu liderazgo en Flandes, tus metas y trabajo comunitario..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
            </div>

            {/* Photo & Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  URL de Foto de Perfil
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="url"
                    value={regPhotoUrl}
                    onChange={e => setRegPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Instagram
                </label>
                <div className="relative">
                  <Share2 className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={regInstagram}
                    onChange={e => setRegInstagram(e.target.value)}
                    placeholder="@usuario"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="300 123 4567"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 px-4 text-sm font-semibold text-white bg-red-900 hover:bg-red-950 dark:bg-red-800 dark:hover:bg-red-900 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-2">⏳</span>
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              <span>Crear mi Cuenta de Consejero(a) Oficial</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
