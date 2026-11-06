/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'admin'
  | 'presidente'
  | 'vicepresidente'
  | 'secretario'
  | 'consejero'
  | 'comision_coord';

export type RepresentationSector =
  | 'Listas Independientes'
  | 'Partidos y Movimientos Políticos'
  | 'Procesos y Prácticas Organizativas'
  | 'Comunidades Campesinas y Étnicas';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended';
  sector?: RepresentationSector;
  commissionId?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  isSuperAdmin?: boolean;
}

export interface ConsejeroProfile {
  id: string;
  userId?: string;
  name: string;
  roleTitle: string; // e.g. Presidente, Vicepresidente, Secretario, Consejero Municipal
  isMesaDirectiva: boolean;
  mesaDirectivaPosition?: 'Presidente' | 'Vicepresidente' | 'Secretario General';
  representationSector: RepresentationSector;
  partyOrOrgName: string; // Nombre del partido, movimiento o lista independiente
  commissionId: string;
  commissionName: string;
  bio: string;
  functions: string[];
  initiatives: string[];
  projects: string[];
  photoUrl: string;
  contactEmail: string;
  phone?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  period: string; // e.g. "2024 - 2026"
  status: 'Activo' | 'En Licencia' | 'Retirado';
  order: number;
}

export interface Commission {
  id: string;
  name: string;
  slug: string;
  description: string;
  coordinatorName: string;
  membersCount: number;
  meetingSchedule: string;
  strategicObjectives: string[];
  activeProjectsCount: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'Institucional' | 'Convocatoria' | 'Sesiones' | 'Cultura y Deporte' | 'Participación';
  imageUrl: string;
  author: string;
  publishedAt: string;
  status: 'published' | 'draft';
  tags: string[];
  featured?: boolean;
}

export interface DocumentItem {
  id: string;
  radicadoNumber: string;
  title: string;
  category: 'Acta de Sesión' | 'Resolución' | 'Convocatoria' | 'Reglamento' | 'Informe de Gestión' | 'Gaceta Juvenil';
  date: string;
  sessionNumber?: string;
  description: string;
  fileSize: string;
  pagesCount: number;
  isPublic: boolean;
  fileUrl?: string;
  status: 'Aprobada' | 'En Revisión' | 'Vigente';
  tags: string[];
}

export interface CouncilSession {
  id: string;
  sessionNumber: string;
  title: string;
  type: 'Ordinaria' | 'Extraordinaria' | 'Conjunta' | 'Asamblea Juvenil';
  date: string;
  time: string;
  location: string;
  orderOfDay: string[];
  status: 'Programada' | 'Realizada' | 'Cancelada';
  quorumRequired: number;
  quorumConfirmed?: number;
  actaId?: string;
  summaryResults?: string;
}

export interface YouthProject {
  id: string;
  code: string;
  title: string;
  commissionId: string;
  commissionName: string;
  leadConsejero: string;
  objective: string;
  justification: string;
  budgetEstimate: string;
  startDate: string;
  endDate: string;
  status: 'Formulación' | 'Radicado en Alcaldía' | 'En Ejecución' | 'Culminado';
  progressPercentage: number;
  beneficiaries: string;
  impactZone: string;
  milestones: {
    title: string;
    completed: boolean;
    date: string;
  }[];
}

export interface YouthActivity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: 'Taller' | 'Encuentro Juvenil' | 'Deporte' | 'Cultura' | 'Mesa de Trabajo';
  description: string;
  requirements?: string;
  registrationOpen: boolean;
  contactEmail?: string;
}

export interface CitizenProposal {
  id: string;
  radicadoCode: string;
  fullName: string;
  documentNumber?: string;
  age: number;
  neighborhoodOrVereda: string;
  email: string;
  phone: string;
  topic: 'Educación' | 'Medio Ambiente' | 'Salud y Deporte' | 'Cultura' | 'Emprendimiento' | 'Seguridad y DDHH' | 'Infraestructura Juvenil';
  title: string;
  description: string;
  createdAt: string;
  status: 'Radicado' | 'En Estudio por Comisión' | 'Respondido' | 'Convertido en Proposición';
  assignedCommission?: string;
  officialResponse?: string;
  responseDate?: string;
}

export interface PublicPoll {
  id: string;
  title: string;
  description: string;
  category: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  active: boolean;
  closesAt: string;
}

export interface CommitmentTask {
  id: string;
  title: string;
  description: string;
  assignedToName: string;
  assignedToRole: string;
  dueDate: string;
  priority: 'Alta' | 'Media' | 'Baja';
  status: 'Pendiente' | 'En Progreso' | 'Cumplido' | 'Atrasado';
  sessionId?: string;
  evidenceNotes?: string;
  completedAt?: string;
}

export interface InternalVote {
  id: string;
  title: string;
  description: string;
  type: 'Decisión Institucional' | 'Consulta Informal';
  options: string[];
  votes: {
    consejeroId: string;
    consejeroName: string;
    selectedOption: string;
    votedAt: string;
  }[];
  status: 'Abierta' | 'Cerrada';
  deadline: string;
}

export interface SocialOversightRecord {
  id: string;
  radicadoNumber: string;
  entityAddressed: string; // e.g. "Alcaldía Municipal de Flandes", "Concejo Municipal", "Empresa de Servicios Públicos"
  subject: string;
  type: 'Derecho de Petición' | 'Solicitud de Información' | 'Control Social' | 'Propuesta Normativa';
  submissionDate: string;
  responseDeadline: string;
  status: 'Pendiente Respuesta' | 'Respondido Favorable' | 'Respondido Incompleto' | 'En Vencimiento';
  notes: string;
  responseSummary?: string;
}

export interface TrainingResource {
  id: string;
  title: string;
  category: 'Leyes y Normas' | 'Liderazgo' | 'Control Social' | 'Formulación de Proyectos' | 'Políticas Públicas';
  description: string;
  format: 'Guía PDF' | 'Presentación' | 'Video explicativo' | 'Enlace Normativo';
  linkOrFile: string;
  readingTimeMinutes: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress?: string;
}

export interface InstitutionalPartner {
  id: string;
  name: string;
  category: 'Gobierno Nacional' | 'Entidad Departamental' | 'Administración Municipal' | 'Órgano de Control';
  websiteUrl: string;
  description: string;
  logoText: string;
  accentColor: string;
}
