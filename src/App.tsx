/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { AccessibilityModal } from './components/common/AccessibilityModal';
import { AccessibilityFloatingButton } from './components/common/AccessibilityFloatingButton';

// Public Views
import { HomeView } from './components/views/HomeView';
import { PresentacionView } from './components/views/PresentacionView';
import { QuienesSomosView } from './components/views/QuienesSomosView';
import { IntegrantesView } from './components/views/IntegrantesView';
import { MesaDirectivaView } from './components/views/MesaDirectivaView';
import { GestionView } from './components/views/GestionView';
import { SesionesView } from './components/views/SesionesView';
import { DocumentosView } from './components/views/DocumentosView';
import { ProyectosView } from './components/views/ProyectosView';
import { NoticiasView } from './components/views/NoticiasView';
import { ActividadesView } from './components/views/ActividadesView';
import { ComisionesView } from './components/views/ComisionesView';
import { ParticipacionView } from './components/views/ParticipacionView';
import { EncuestasView } from './components/views/EncuestasView';
import { TransparenciaView } from './components/views/TransparenciaView';
import { LegislacionView } from './components/views/LegislacionView';
import { ContactoView } from './components/views/ContactoView';

// Private Portal
import { PrivatePortal } from './components/portal/PrivatePortal';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('inicio');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const handleNavigate = (view: string) => {
    if (view === 'portal-privado' && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setCurrentView('portal-privado');
  };

  if (currentView === 'portal-privado' && user) {
    return (
      <>
        <PrivatePortal onBackToPublic={() => setCurrentView('inicio')} />
        <AccessibilityModal />
        <AccessibilityFloatingButton />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {currentView === 'inicio' && (
          <HomeView onNavigate={handleNavigate} />
        )}
        {currentView === 'presentacion' && (
          <PresentacionView onNavigate={handleNavigate} />
        )}
        {currentView === 'quienes-somos' && (
          <QuienesSomosView />
        )}
        {currentView === 'integrantes' && (
          <IntegrantesView
            onNavigateToAdmin={() => handleNavigate('portal-privado')}
            onOpenRegister={() => setIsLoginModalOpen(true)}
          />
        )}
        {currentView === 'mesa-directiva' && (
          <MesaDirectivaView />
        )}
        {currentView === 'gestion' && (
          <GestionView onNavigate={handleNavigate} />
        )}
        {currentView === 'sesiones' && (
          <SesionesView />
        )}
        {currentView === 'documentos' && (
          <DocumentosView />
        )}
        {currentView === 'proyectos' && (
          <ProyectosView />
        )}
        {currentView === 'noticias' && (
          <NoticiasView />
        )}
        {currentView === 'actividades' && (
          <ActividadesView />
        )}
        {currentView === 'comisiones' && (
          <ComisionesView />
        )}
        {currentView === 'participacion' && (
          <ParticipacionView />
        )}
        {currentView === 'encuestas' && (
          <EncuestasView />
        )}
        {currentView === 'transparencia' && (
          <TransparenciaView onNavigate={handleNavigate} />
        )}
        {currentView === 'legislacion' && (
          <LegislacionView />
        )}
        {currentView === 'contacto' && (
          <ContactoView />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <AccessibilityModal />
      <AccessibilityFloatingButton />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <AppContent />
        </SiteSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
