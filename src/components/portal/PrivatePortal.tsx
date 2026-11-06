/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  User,
  ConsejeroProfile,
  CouncilSession,
  CommitmentTask,
  YouthProject,
  InternalVote,
  SocialOversightRecord,
  CitizenProposal,
  AuditLogEntry,
  TrainingResource,
  DocumentItem
} from '../../types';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CheckSquare,
  FolderGit2,
  Users,
  MessageSquare,
  Lock,
  UserCheck,
  Vote,
  Target,
  ShieldAlert,
  GraduationCap,
  FileSpreadsheet,
  Settings,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Shield,
  Send
} from 'lucide-react';

interface PrivatePortalProps {
  onBackToPublic: () => void;
}

export const PrivatePortal: React.FC<PrivatePortalProps> = ({ onBackToPublic }) => {
  const { user, logout, hasRole } = useAuth();
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Data states
  const [sessions, setSessions] = useState<CouncilSession[]>([]);
  const [commitments, setCommitments] = useState<CommitmentTask[]>([]);
  const [projects, setProjects] = useState<YouthProject[]>([]);
  const [internalVotes, setInternalVotes] = useState<InternalVote[]>([]);
  const [oversight, setOversight] = useState<SocialOversightRecord[]>([]);
  const [citizenProposals, setCitizenProposals] = useState<CitizenProposal[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [consejeros, setConsejeros] = useState<ConsejeroProfile[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [training, setTraining] = useState<TrainingResource[]>([]);

  // Modals & form states
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isEditConsejeroOpen, setIsEditConsejeroOpen] = useState(false);
  const [selectedConsejeroToEdit, setSelectedConsejeroToEdit] = useState<ConsejeroProfile | null>(null);
  const [selectedProposalToRespond, setSelectedProposalToRespond] = useState<CitizenProposal | null>(null);
  const [officialResponseText, setOfficialResponseText] = useState('');
  const [officialResponseStatus, setOfficialResponseStatus] = useState('Respondido');

  // New item form buffers
  const [newSessionData, setNewSessionData] = useState({
    sessionNumber: `Sesión Plenaria N° 03 - 2026`,
    title: '',
    type: 'Ordinaria' as const,
    date: new Date().toISOString().split('T')[0],
    time: '03:00 PM',
    location: 'Recinto del Concejo Municipal de Flandes',
    orderOfDayText: '1. Llamado a lista y verificación del quórum.\n2. Lectura y aprobación del acta anterior.\n3. Debate de proposiciones.\n4. Asuntos varios.',
    quorumRequired: 3,
  });

  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignedToName: user?.name || 'Mesa Directiva',
    assignedToRole: user?.role || 'Consejero',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    priority: 'Alta' as const,
  });

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'consejero',
    sector: 'Listas Independientes',
    phone: '',
  });

  useEffect(() => {
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    try {
      const [
        sess,
        comms,
        projs,
        votes,
        ovs,
        proposals,
        cons,
        docs,
        train
      ] = await Promise.all([
        api.getSessions(),
        api.getCommitments(),
        api.getProjects(),
        api.getInternalVotes(),
        api.getSocialOversight(),
        api.getCitizenProposals(),
        api.getConsejeros(),
        api.getDocuments(),
        api.getTraining(),
      ]);

      setSessions(sess);
      setCommitments(comms);
      setProjects(projs);
      setInternalVotes(votes);
      setOversight(ovs);
      setCitizenProposals(proposals);
      setConsejeros(cons);
      setDocuments(docs);
      setTraining(train);

      if (user?.role === 'admin') {
        const [usersData, logsData] = await Promise.all([
          api.getAdminUsers(),
          api.getAuditLogs(),
        ]);
        setAdminUsers(usersData);
        setAuditLogs(logsData);
      }
    } catch (err) {
      console.error('Error loading private portal data:', err);
    }
  };

  // Handlers
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderOfDay = newSessionData.orderOfDayText.split('\n').filter(line => line.trim().length > 0);
      await api.createSession({
        sessionNumber: newSessionData.sessionNumber,
        title: newSessionData.title,
        type: newSessionData.type,
        date: newSessionData.date,
        time: newSessionData.time,
        location: newSessionData.location,
        orderOfDay,
        status: 'Programada',
        quorumRequired: newSessionData.quorumRequired,
      });
      setIsNewSessionOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Error al convocar sesión');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCommitment({
        ...newTaskData,
        status: 'Pendiente',
      });
      setIsNewTaskOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Error al registrar compromiso');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: any) => {
    try {
      await api.updateCommitment(taskId, {
        status: newStatus,
        completedAt: newStatus === 'Cumplido' ? new Date().toISOString() : undefined,
      });
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVoteInternal = async (voteId: string, opt: string) => {
    try {
      await api.castInternalVote(voteId, opt);
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRespondProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposalToRespond) return;
    try {
      await api.respondCitizenProposal(selectedProposalToRespond.id, {
        status: officialResponseStatus,
        officialResponse: officialResponseText,
      });
      setSelectedProposalToRespond(null);
      setOfficialResponseText('');
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminUser(newUserData);
      setIsNewUserOpen(false);
      setNewUserData({ name: '', email: '', password: '', role: 'consejero', sector: 'Listas Independientes', phone: '' });
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Está seguro de eliminar esta cuenta autorizada? Esta acción no se puede deshacer.')) return;
    try {
      await api.deleteAdminUser(userId);
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveConsejeroEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsejeroToEdit) return;
    try {
      await api.updateConsejero(selectedConsejeroToEdit.id, selectedConsejeroToEdit);
      setIsEditConsejeroOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportBackup = async () => {
    try {
      const data = await api.getBackupDownload();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-cmj-flandes-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (err: any) {
      alert(err.message || 'Error al exportar copia de seguridad');
    }
  };

  const modulesList = [
    { id: 'dashboard', label: '1. Panel Principal', icon: LayoutDashboard },
    { id: 'sesiones', label: '2. Gestión de Sesiones', icon: Calendar },
    { id: 'secretaria', label: '3. Secretaría Digital', icon: FileText },
    { id: 'compromisos', label: '4. Compromisos y Tareas', icon: CheckSquare },
    { id: 'proyectos', label: '5. Banco de Proyectos', icon: FolderGit2 },
    { id: 'comisiones', label: '6. Comisiones', icon: Users },
    { id: 'comunicacion', label: '7. Comunicación Interna', icon: MessageSquare },
    { id: 'biblioteca', label: '8. Biblioteca Privada', icon: Lock },
    { id: 'asistencia', label: '9. Asistencia Plenarias', icon: UserCheck },
    { id: 'votaciones', label: '10. Votaciones Internas', icon: Vote },
    { id: 'plan-trabajo', label: '11. Plan de Trabajo', icon: Target },
    { id: 'veeduria', label: '12. Veeduría y Control Social', icon: ShieldAlert },
    { id: 'formacion', label: '13. Recursos Formativos', icon: GraduationCap },
    { id: 'informes', label: '14. Generador de Informes', icon: FileSpreadsheet },
    ...(user?.role === 'admin'
      ? [
          { id: 'admin-usuarios', label: 'Adm: Cuentas y Permisos', icon: Settings },
          { id: 'admin-consejeros', label: 'Adm: Perfiles Consejeros', icon: Users },
          { id: 'admin-buzon', label: 'Adm: Buzón Ciudadano', icon: Send },
          { id: 'admin-auditoria', label: 'Adm: Auditoría y Copias', icon: Shield },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col">
      {/* Top Bar inside Private Area */}
      <div className="bg-red-950 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-red-900 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-sm sm:text-base tracking-tight">
            CMJ FLANDES · PORTAL PRIVADO
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-900/80 text-amber-300">
            Rol: {user?.role.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline text-stone-300">
            Usuario: <strong>{user?.name}</strong> ({user?.email})
          </span>
          <button
            onClick={onBackToPublic}
            className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            ← Volver al Portal Público
          </button>
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-white font-semibold transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Nav: 3 Cols */}
        <div className="lg:col-span-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-widest text-stone-400 px-3 py-1.5 font-sans">
            Módulos del Consejo
          </div>
          {modulesList.map(mod => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-red-900 text-white shadow-xs font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{mod.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane: 9 Cols */}
        <div className="lg:col-span-9 space-y-6">
          {/* ==================================================== */}
          {/* MODULE 1: DASHBOARD */}
          {/* ==================================================== */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Bienvenido, {user?.name}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Panel interno de trabajo del Consejo Municipal de Juventud de Flandes.
                  </p>
                </div>
                {hasRole(['admin', 'presidente', 'secretario']) && (
                  <button
                    onClick={() => setIsNewSessionOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Convocar Nueva Sesión</span>
                  </button>
                )}
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] text-stone-500 uppercase font-sans">Compromisos Activos</span>
                  <div className="text-2xl font-bold font-sans text-red-900 dark:text-red-400 mt-1 tabular-nums">
                    {commitments.filter(c => c.status !== 'Cumplido').length}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] text-stone-500 uppercase font-sans">Sesiones Programadas</span>
                  <div className="text-2xl font-bold font-sans text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
                    {sessions.filter(s => s.status === 'Programada').length}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] text-stone-500 uppercase font-sans">Iniciativas en Banco</span>
                  <div className="text-2xl font-bold font-sans text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
                    {projects.length}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] text-stone-500 uppercase font-sans">Peticiones Ciudadanas</span>
                  <div className="text-2xl font-bold font-sans text-blue-900 dark:text-blue-400 mt-1 tabular-nums">
                    {citizenProposals.length}
                  </div>
                </div>
              </div>

              {/* Upcoming Plenary Alert */}
              {sessions.find(s => s.status === 'Programada') && (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-stone-800 dark:text-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase">
                    <Clock className="w-4 h-4" />
                    <span>Próxima Convocatoria Plenaria Oficial</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-100">
                    {sessions.find(s => s.status === 'Programada')?.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs text-amber-900/80 dark:text-amber-300">
                    <span>Fecha: <strong>{sessions.find(s => s.status === 'Programada')?.date}</strong></span>
                    <span>Hora: <strong>{sessions.find(s => s.status === 'Programada')?.time}</strong></span>
                    <span>Lugar: <strong>{sessions.find(s => s.status === 'Programada')?.location}</strong></span>
                  </div>
                </div>
              )}

              {/* Active Tasks Table */}
              <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                    Compromisos y Tareas Institucionales
                  </h3>
                  <button
                    onClick={() => setActiveModule('compromisos')}
                    className="text-xs font-semibold text-red-900 dark:text-red-400 hover:underline"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {commitments.slice(0, 4).map(tsk => (
                    <div
                      key={tsk.id}
                      className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/50 dark:bg-stone-800/40"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-stone-900 dark:text-white block">{tsk.title}</span>
                        <span className="text-[11px] text-stone-500">
                          Responsable: {tsk.assignedToName} · Vence: {tsk.dueDate}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tsk.status === 'Cumplido'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {tsk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 2: GESTIÓN DE SESIONES */}
          {/* ==================================================== */}
          {activeModule === 'sesiones' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Gestión y Programación de Sesiones
                  </h2>
                  <p className="text-xs text-stone-500">
                    Convocatorias formales, verificación de quórum y actas de plenaria.
                  </p>
                </div>
                {hasRole(['admin', 'presidente', 'secretario']) && (
                  <button
                    onClick={() => setIsNewSessionOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Convocar Sesión</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {sessions.map(ses => (
                  <div
                    key={ses.id}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 bg-stone-50/50 dark:bg-stone-800/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-red-900 dark:text-red-400">
                        {ses.sessionNumber} ({ses.type})
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-stone-200 dark:bg-stone-700">
                        {ses.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white">
                      {ses.title}
                    </h4>

                    <div className="text-xs text-stone-600 dark:text-stone-300 flex flex-wrap gap-4">
                      <span>Fecha: <strong>{ses.date}</strong></span>
                      <span>Hora: <strong>{ses.time}</strong></span>
                      <span>Lugar: <strong>{ses.location}</strong></span>
                    </div>

                    {ses.orderOfDay && (
                      <div className="text-xs p-3 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                        <strong className="block text-stone-700 dark:text-stone-300">Orden del Día:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-stone-600 dark:text-stone-400">
                          {ses.orderOfDay.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 3: SECRETARÍA DIGITAL */}
          {/* ==================================================== */}
          {activeModule === 'secretaria' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Secretaría Digital y Archivo de Actas
                </h2>
                <p className="text-xs text-stone-500">
                  Custodia oficial, elaboración y foliatura de actas de sesiones ordinarias y extraordinarias.
                </p>
              </div>

              <div className="space-y-4">
                {documents.filter(d => d.category === 'Acta de Sesión' || d.category === 'Resolución').map(doc => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-stone-50/50 dark:bg-stone-800/40 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-red-900 dark:text-red-400 block mb-1">
                        {doc.radicadoNumber} · {doc.date}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                        {doc.title}
                      </h4>
                      <p className="text-stone-500 mt-1 line-clamp-1">{doc.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-0.5 rounded font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 mb-2">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 4: COMPROMISOS Y TAREAS */}
          {/* ==================================================== */}
          {activeModule === 'compromisos' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Compromisos y Tareas Institucionales
                  </h2>
                  <p className="text-xs text-stone-500">
                    Seguimiento a responsabilidades asignadas en sesiones plenarias y mesas de comisión.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewTaskOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Compromiso</span>
                </button>
              </div>

              <div className="space-y-4">
                {commitments.map(tsk => (
                  <div
                    key={tsk.id}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 bg-stone-50/50 dark:bg-stone-800/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white">
                        {tsk.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300">
                          Prioridad {tsk.priority}
                        </span>
                        <select
                          value={tsk.status}
                          onChange={e => handleUpdateTaskStatus(tsk.id, e.target.value)}
                          className="text-xs px-2.5 py-1 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Progreso">En Progreso</option>
                          <option value="Cumplido">Cumplido</option>
                          <option value="Atrasado">Atrasado</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {tsk.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <span>Responsable: <strong>{tsk.assignedToName}</strong> ({tsk.assignedToRole})</span>
                      <span>Fecha Límite: <strong>{tsk.dueDate}</strong></span>
                    </div>

                    {tsk.evidenceNotes && (
                      <div className="p-2.5 rounded bg-white dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
                        <strong>Evidencias / Notas:</strong> {tsk.evidenceNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 5: BANCO DE PROYECTOS */}
          {/* ==================================================== */}
          {activeModule === 'proyectos' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Banco de Proyectos Juveniles
                </h2>
                <p className="text-xs text-stone-500">
                  Seguimiento y evaluación a iniciativas radicadas ante el gobierno municipal.
                </p>
              </div>

              <div className="space-y-4">
                {projects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 bg-stone-50/50 dark:bg-stone-800/40"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-stone-400">{proj.code}</span>
                        <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white mt-0.5">
                          {proj.title}
                        </h4>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 font-semibold">
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {proj.objective}
                    </p>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Avance global:</span>
                        <span className="font-mono font-bold">{proj.progressPercentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-900 dark:bg-red-500 rounded-full"
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 6: COMISIONES */}
          {/* ==================================================== */}
          {activeModule === 'comisiones' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Trabajo Interno de Comisiones
                </h2>
                <p className="text-xs text-stone-500">
                  Coordinación de reuniones temáticas, asignaciones y ponencias.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {consejeros.map(c => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between gap-4"
                  >
                    <div>
                      <strong className="text-stone-900 dark:text-white block text-sm">{c.name}</strong>
                      <span className="text-stone-500">{c.roleTitle} · {c.commissionName}</span>
                    </div>
                    <span className="text-stone-400 font-mono">{c.representationSector}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 7: COMUNICACIÓN INTERNA */}
          {/* ==================================================== */}
          {activeModule === 'comunicacion' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Tablero de Comunicación Interna
                </h2>
                <p className="text-xs text-stone-500">
                  Memos, comunicados oficiales entre consejeros y notificaciones de secretaría.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900 dark:text-red-400 font-sans uppercase">
                    Memorando N° 004 - Secretaría General
                  </span>
                  <span className="text-stone-400">Hace 2 días</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                  Recordatorio: Envío de ponencias antes de la plenaria ordinaria
                </h4>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Se recuerda a todos los coordinadores de comisión radicar los informes de avance a más tardar 48 horas antes de la sesión ordinaria programada para garantizar la debida foliación en el expediente.
                </p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 8: BIBLIOTECA PRIVADA */}
          {/* ==================================================== */}
          {activeModule === 'biblioteca' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Biblioteca Privada y Documentos de Trabajo
                </h2>
                <p className="text-xs text-stone-500">
                  Borradores de proyectos de acuerdo, minutas jurídicas y documentos reservados.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                      Borrador: Pliego de Peticiones Transporte Estudiantil Flandes - Girardot
                    </h4>
                    <span className="text-stone-400">En revisión jurídica por la Mesa Directiva</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono">
                    DOCX · 340 KB
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                      Matriz de Viabilidad Presupuestal: Casa Municipal de la Juventud 2026
                    </h4>
                    <span className="text-stone-400">Elaborado por la Comisión de Emprendimiento y Hacienda</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono">
                    XLSX · 180 KB
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 9: ASISTENCIA */}
          {/* ==================================================== */}
          {activeModule === 'asistencia' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Registro Oficial de Asistencia
                </h2>
                <p className="text-xs text-stone-500">
                  Control de quórum, presencias y justificación de inasistencias en plenarias.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Consejero(a)</th>
                      <th className="p-3">Sesión Plenaria N° 01</th>
                      <th className="p-3">Sesión Extraordinaria N° 01</th>
                      <th className="p-3">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {consejeros.map(c => (
                      <tr key={c.id}>
                        <td className="p-3 font-semibold text-stone-900 dark:text-white">{c.name}</td>
                        <td className="p-3 text-emerald-600 font-bold">Presente</td>
                        <td className="p-3 text-emerald-600 font-bold">Presente</td>
                        <td className="p-3 font-mono font-bold text-stone-700 dark:text-stone-300">100%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 10: VOTACIONES INTERNAS */}
          {/* ==================================================== */}
          {activeModule === 'votaciones' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Consultas y Votaciones Internas del CMJ
                </h2>
                <p className="text-xs text-stone-500">
                  Votaciones nominales sobre proposiciones institucionales y consultas internas.
                </p>
              </div>

              <div className="space-y-6">
                {internalVotes.map(vote => (
                  <div
                    key={vote.id}
                    className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 bg-stone-50/50 dark:bg-stone-800/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-900 dark:text-red-400">
                        {vote.type}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-stone-200 dark:bg-stone-700">
                        Estado: {vote.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                      {vote.title}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {vote.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {vote.options.map((opt, i) => {
                        const count = vote.votes.filter(v => v.selectedOption === opt).length;
                        return (
                          <button
                            key={i}
                            onClick={() => handleVoteInternal(vote.id, opt)}
                            className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold hover:border-red-900 transition-colors flex items-center gap-2"
                          >
                            <span>{opt}</span>
                            <span className="font-mono tabular-nums text-stone-400">({count} votos)</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Roll-call transparency audit */}
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs space-y-1">
                      <strong className="block text-stone-700 dark:text-stone-300">
                        Registro de Votos Emitidos (Transparencia):
                      </strong>
                      {vote.votes.map((v, i) => (
                        <div key={i} className="flex justify-between text-stone-600 dark:text-stone-400">
                          <span>{v.consejeroName}</span>
                          <span className="font-semibold text-stone-900 dark:text-white">{v.selectedOption}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 11: PLAN DE TRABAJO ANUAL */}
          {/* ==================================================== */}
          {activeModule === 'plan-trabajo' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Plan de Trabajo Institucional 2026
                </h2>
                <p className="text-xs text-stone-500">
                  Líneas estratégicas, metas cuantitativas e indicadores del CMJ Flandes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 bg-stone-50 dark:bg-stone-800/40">
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    Línea 1: Concertación y Presupuesto
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300">
                    Realizar 2 sesiones plenarias con el Alcalde Municipal de Flandes para garantizar al menos $65.000.000 COP en proyectos de juventud.
                  </p>
                  <div className="font-mono text-emerald-700 font-bold">Meta: 50% alcanzada</div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 bg-stone-50 dark:bg-stone-800/40">
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    Línea 2: Descentralización Veredal
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300">
                    Visitar las 4 veredas de Flandes (Paradero, Colegio, Topacio, Camala) realizando audiencias de escucha con juventudes rurales.
                  </p>
                  <div className="font-mono text-amber-700 font-bold">Meta: 25% alcanzada</div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 12: VEEDURÍA Y CONTROL SOCIAL */}
          {/* ==================================================== */}
          {activeModule === 'veeduria' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Veeduría y Control Social a Entidades
                </h2>
                <p className="text-xs text-stone-500">
                  Seguimiento a derechos de petición, radicados ante la Alcaldía, Concejo Municipal y CORTOLIMA.
                </p>
              </div>

              <div className="space-y-4">
                {oversight.map(ov => (
                  <div
                    key={ov.id}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 bg-stone-50/50 dark:bg-stone-800/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-red-900 dark:text-red-400">
                        {ov.radicadoNumber} · {ov.type}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700">
                        {ov.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white">
                      Entidad: {ov.entityAddressed}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Asunto: <strong>{ov.subject}</strong>
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-stone-500">
                      <span>Radicado: {ov.submissionDate}</span>
                      <span>Vencimiento legal: {ov.responseDeadline}</span>
                    </div>

                    {ov.responseSummary && (
                      <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-200">
                        <strong>Respuesta Obtenida:</strong> {ov.responseSummary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 13: FORMACIÓN */}
          {/* ==================================================== */}
          {activeModule === 'formacion' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Biblioteca de Formación y Recursos
                </h2>
                <p className="text-xs text-stone-500">
                  Guías pedagógicas sobre Ley 1622, formulación MGA, veedurías y liderazgo democrático.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {training.map(tr => (
                  <div
                    key={tr.id}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">
                        {tr.category} · {tr.format}
                      </span>
                      <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white mt-1">
                        {tr.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                        {tr.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
                      <span className="text-stone-400">Lectura: {tr.readingTimeMinutes} min</span>
                      <a
                        href={tr.linkOrFile}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-red-900 dark:text-red-400 hover:underline"
                      >
                        Abrir recurso →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 14: GENERADOR DE INFORMES DE GESTIÓN */}
          {/* ==================================================== */}
          {activeModule === 'informes' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Generador Oficial de Informes de Gestión
                  </h2>
                  <p className="text-xs text-stone-500">
                    Compila automáticamente la información real registrada para rendiciones de cuentas.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 border border-stone-300 dark:border-stone-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Exportar Informe</span>
                </button>
              </div>

              {/* Printable Document Sheet */}
              <div className="p-8 bg-white text-stone-900 border border-stone-300 rounded-xl space-y-6 text-xs font-sans">
                <div className="text-center border-b pb-4 space-y-1">
                  <p className="font-bold text-stone-600 uppercase text-[10px]">
                    CONSEJO MUNICIPAL DE JUVENTUD DE FLANDES (TOLIMA)
                  </p>
                  <h3 className="font-serif font-bold text-lg uppercase">
                    INFORME EJECUTIVO DE GESTIÓN INSTITUCIONAL
                  </h3>
                  <p className="text-stone-500 text-[11px]">
                    Periodo Constitucional: 2024 - 2026 · Corte a fecha: {new Date().toLocaleDateString('es-CO')}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center p-3 bg-stone-50 rounded border">
                  <div>
                    <span className="block text-stone-500">Plenarias Realizadas:</span>
                    <strong className="text-base font-mono">{sessions.filter(s => s.status === 'Realizada').length}</strong>
                  </div>
                  <div>
                    <span className="block text-stone-500">Actas Aprobadas:</span>
                    <strong className="text-base font-mono">{documents.length}</strong>
                  </div>
                  <div>
                    <span className="block text-stone-500">Iniciativas Activas:</span>
                    <strong className="text-base font-mono">{projects.length}</strong>
                  </div>
                  <div>
                    <span className="block text-stone-500">Peticiones Ciudadanas:</span>
                    <strong className="text-base font-mono">{citizenProposals.length}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold uppercase text-stone-800">1. RESUMEN DE PROYECTOS Y GESTIÓN</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {projects.map(p => (
                      <li key={p.id}>
                        <strong>{p.title}</strong>: {p.status} ({p.progressPercentage}% de avance). Beneficiarios: {p.beneficiaries}.
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold uppercase text-stone-800">2. CONTROL SOCIAL Y VEEDURÍA</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {oversight.map(o => (
                      <li key={o.id}>
                        <strong>{o.radicadoNumber}</strong> ante {o.entityAddressed}: {o.status}. Asunto: {o.subject}.
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* ADMIN: USER & ROLE MANAGEMENT */}
          {/* ==================================================== */}
          {activeModule === 'admin-usuarios' && user?.role === 'admin' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Administración de Cuentas Autorizadas
                  </h2>
                  <p className="text-xs text-stone-500">
                    Control técnico de usuarios, roles institucionales y contraseñas.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewUserOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Nuevo Usuario</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Correo Institucional</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {adminUsers.map(u => (
                      <tr key={u.id}>
                        <td className="p-3 font-semibold text-stone-900 dark:text-white">
                          {u.name}
                          {u.isSuperAdmin && (
                            <span className="ml-2 text-[9px] bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">
                              SuperAdmin Protegido
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-stone-500 font-mono">{u.email}</td>
                        <td className="p-3 uppercase font-semibold text-amber-800 dark:text-amber-400">{u.role}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {!u.isSuperAdmin && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 text-red-600 hover:text-red-800 rounded transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* ADMIN: CONSEJEROS PROFILE CRUD */}
          {/* ==================================================== */}
          {activeModule === 'admin-consejeros' && user?.role === 'admin' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Administración de Perfiles de Consejeros
                  </h2>
                  <p className="text-xs text-stone-500">
                    Actualiza con nombres reales, fotos, biografías y funciones reglamentarias.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {consejeros.map(c => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-stone-50/50 dark:bg-stone-800/40 text-xs"
                  >
                    <div>
                      <span className="font-bold text-red-900 dark:text-red-400 font-sans block">
                        {c.roleTitle} · {c.partyOrOrgName}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white mt-0.5">
                        {c.name}
                      </h4>
                      <p className="text-stone-500 mt-1">{c.commissionName}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedConsejeroToEdit(c);
                        setIsEditConsejeroOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-semibold flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar Datos Reales</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* ADMIN: BUZÓN CIUDADANO (MODERATION & RESPONSES) */}
          {/* ==================================================== */}
          {activeModule === 'admin-buzon' && (user?.role === 'admin' || user?.role === 'secretario' || user?.role === 'presidente') && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                  Buzón Ciudadano: Gestión y Respuestas Oficiales
                </h2>
                <p className="text-xs text-stone-500">
                  Responde institucionalmente a las iniciativas y peticiones radicadas por los jóvenes de Flandes.
                </p>
              </div>

              <div className="space-y-4">
                {citizenProposals.map(prop => (
                  <div
                    key={prop.id}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 bg-stone-50/50 dark:bg-stone-800/40 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-mono font-bold text-red-900 dark:text-red-400">
                        {prop.radicadoCode} · {prop.topic}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        {prop.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white">
                      {prop.title}
                    </h4>

                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                      {prop.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-stone-500">
                      <span>Proponente: <strong>{prop.fullName}</strong> ({prop.age} años)</span>
                      <span>Sector: <strong>{prop.neighborhoodOrVereda}</strong></span>
                      <span>Contacto: {prop.email} {prop.phone && `· ${prop.phone}`}</span>
                    </div>

                    {prop.officialResponse ? (
                      <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900">
                        <strong>Respuesta Registrada:</strong> {prop.officialResponse}
                      </div>
                    ) : (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedProposalToRespond(prop);
                            setOfficialResponseText('');
                          }}
                          className="px-4 py-2 rounded-lg bg-red-900 text-white font-semibold hover:bg-red-950 transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Redactar Respuesta Oficial</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* ADMIN: AUDITORÍA Y COPIAS DE SEGURIDAD */}
          {/* ==================================================== */}
          {activeModule === 'admin-auditoria' && user?.role === 'admin' && (
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Seguridad, Auditoría y Copias de Respaldo
                  </h2>
                  <p className="text-xs text-stone-500">
                    Historial de auditoría inmutable y exportación de datos para recuperación ante desastres.
                  </p>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-900 hover:bg-red-950 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Copia de Seguridad JSON</span>
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                  Últimos Registros de Seguridad (Auditoría):
                </h4>
                <div className="max-h-96 overflow-y-auto space-y-2 text-xs">
                  {auditLogs.slice(0, 30).map(log => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-start justify-between gap-4 font-mono text-[11px]"
                    >
                      <div>
                        <span className="text-red-900 dark:text-red-400 font-bold uppercase mr-2">
                          [{log.action}]
                        </span>
                        <span className="text-stone-700 dark:text-stone-300">{log.details}</span>
                        <div className="text-stone-400 mt-0.5">
                          Usuario: {log.userName} ({log.userEmail}) · IP: {log.ipAddress}
                        </div>
                      </div>
                      <span className="text-stone-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString('es-CO')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Convocar Nueva Sesión */}
      {isNewSessionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
              Convocar Nueva Sesión Plenaria
            </h3>
            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Título de la Sesión *</label>
                <input
                  type="text"
                  required
                  value={newSessionData.title}
                  onChange={e => setNewSessionData(d => ({ ...d, title: e.target.value }))}
                  placeholder="Ej. Debate de transporte estudiantil y presupuesto 2026"
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newSessionData.date}
                    onChange={e => setNewSessionData(d => ({ ...d, date: e.target.value }))}
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Hora</label>
                  <input
                    type="text"
                    required
                    value={newSessionData.time}
                    onChange={e => setNewSessionData(d => ({ ...d, time: e.target.value }))}
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Lugar</label>
                <input
                  type="text"
                  required
                  value={newSessionData.location}
                  onChange={e => setNewSessionData(d => ({ ...d, location: e.target.value }))}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Orden del Día (un punto por línea)</label>
                <textarea
                  rows={4}
                  value={newSessionData.orderOfDayText}
                  onChange={e => setNewSessionData(d => ({ ...d, orderOfDayText: e.target.value }))}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-[11px]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSessionOpen(false)}
                  className="px-3 py-1.5 rounded bg-stone-200 dark:bg-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-900 text-white font-semibold hover:bg-red-950"
                >
                  Publicar Convocatoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Compromiso */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
              Asignar Nuevo Compromiso Institucional
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Título del Compromiso *</label>
                <input
                  type="text"
                  required
                  value={newTaskData.title}
                  onChange={e => setNewTaskData(d => ({ ...d, title: e.target.value }))}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Descripción y Entregable</label>
                <textarea
                  rows={3}
                  value={newTaskData.description}
                  onChange={e => setNewTaskData(d => ({ ...d, description: e.target.value }))}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Responsable</label>
                  <input
                    type="text"
                    required
                    value={newTaskData.assignedToName}
                    onChange={e => setNewTaskData(d => ({ ...d, assignedToName: e.target.value }))}
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    value={newTaskData.dueDate}
                    onChange={e => setNewTaskData(d => ({ ...d, dueDate: e.target.value }))}
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-3 py-1.5 rounded bg-stone-200 dark:bg-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-900 text-white font-semibold hover:bg-red-950"
                >
                  Guardar Compromiso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Usuario Autorizado (Admin) */}
      {isNewUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
              Crear Nueva Cuenta Autorizada
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={e => setNewUserData(d => ({ ...d, name: e.target.value }))}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Correo Electrónico Institucional *</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={e => setNewUserData(d => ({ ...d, email: e.target.value }))}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Contraseña Inicial (mín. 8 caracteres) *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newUserData.password}
                  onChange={e => setNewUserData(d => ({ ...d, password: e.target.value }))}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Rol</label>
                  <select
                    value={newUserData.role}
                    onChange={e => setNewUserData(d => ({ ...d, role: e.target.value }))}
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    <option value="consejero">Consejero</option>
                    <option value="presidente">Presidente</option>
                    <option value="vicepresidente">Vicepresidente</option>
                    <option value="secretario">Secretario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newUserData.phone}
                    onChange={e => setNewUserData(d => ({ ...d, phone: e.target.value }))}
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserOpen(false)}
                  className="px-3 py-1.5 rounded bg-stone-200 dark:bg-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-900 text-white font-semibold hover:bg-red-950"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Perfil de Consejero (Admin) */}
      {isEditConsejeroOpen && selectedConsejeroToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-2xl p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
              Actualizar Datos Reales de la Curul
            </h3>
            <form onSubmit={handleSaveConsejeroEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nombre Completo del Consejero *</label>
                <input
                  type="text"
                  required
                  value={selectedConsejeroToEdit.name}
                  onChange={e => setSelectedConsejeroToEdit(c => c ? { ...c, name: e.target.value } : null)}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Cargo Institucional</label>
                <input
                  type="text"
                  required
                  value={selectedConsejeroToEdit.roleTitle}
                  onChange={e => setSelectedConsejeroToEdit(c => c ? { ...c, roleTitle: e.target.value } : null)}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Lista / Partido / Organización</label>
                <input
                  type="text"
                  required
                  value={selectedConsejeroToEdit.partyOrOrgName}
                  onChange={e => setSelectedConsejeroToEdit(c => c ? { ...c, partyOrOrgName: e.target.value } : null)}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Biografía y Perfil</label>
                <textarea
                  rows={4}
                  value={selectedConsejeroToEdit.bio}
                  onChange={e => setSelectedConsejeroToEdit(c => c ? { ...c, bio: e.target.value } : null)}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Correo Electrónico de Contacto</label>
                <input
                  type="email"
                  value={selectedConsejeroToEdit.contactEmail}
                  onChange={e => setSelectedConsejeroToEdit(c => c ? { ...c, contactEmail: e.target.value } : null)}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">URL de Fotografía Oficial</label>
                <input
                  type="text"
                  placeholder="/src/assets/images/... o URL"
                  value={selectedConsejeroToEdit.photoUrl}
                  onChange={e => setSelectedConsejeroToEdit(c => c ? { ...c, photoUrl: e.target.value } : null)}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditConsejeroOpen(false)}
                  className="px-3 py-1.5 rounded bg-stone-200 dark:bg-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-900 text-white font-semibold hover:bg-red-950"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Redactar Respuesta a Propuesta Ciudadana */}
      {selectedProposalToRespond && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
              Respuesta Institucional al Radicado {selectedProposalToRespond.radicadoCode}
            </h3>
            <p className="text-xs text-stone-500">
              Proponente: {selectedProposalToRespond.fullName} ({selectedProposalToRespond.neighborhoodOrVereda})
            </p>
            <form onSubmit={handleRespondProposal} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nuevo Estado</label>
                <select
                  value={officialResponseStatus}
                  onChange={e => setOfficialResponseStatus(e.target.value)}
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                >
                  <option value="Respondido">Respondido</option>
                  <option value="Convertido en Proposición">Convertido en Proposición de Plenaria</option>
                  <option value="En Estudio por Comisión">En Estudio por Comisión</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Texto de la Respuesta Oficial *</label>
                <textarea
                  required
                  rows={5}
                  value={officialResponseText}
                  onChange={e => setOfficialResponseText(e.target.value)}
                  placeholder="Detalla la respuesta institucional del CMJ Flandes..."
                  className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProposalToRespond(null)}
                  className="px-3 py-1.5 rounded bg-stone-200 dark:bg-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-900 text-white font-semibold hover:bg-red-950"
                >
                  Publicar Respuesta Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
