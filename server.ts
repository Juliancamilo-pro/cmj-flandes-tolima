/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { db as pgDb } from './src/db/index.ts';
import { users as pgUsers, consejeros as pgConsejeros, sessions as pgSessions, documents as pgDocuments, citizenProposals as pgCitizenProposals, polls as pgPolls } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cmj_flandes_tolima_secret_key_2026';
const REGISTRATION_CODE = 'cmj-flandes';
const ADMIN_EMAIL = 'trujillogordilooo@gmail.com';

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure persistent data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const AUDIT_LOGS_FILE = path.join(DATA_DIR, 'audit_logs.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// System Roles and Granular Pre-configured Permissions
export const SYSTEM_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'create_accounts',
    'manage_all_users',
    'delete_users',
    'manage_consejeros',
    'edit_all_consejeros',
    'manage_sessions',
    'create_sessions',
    'delete_sessions',
    'sync_calendar',
    'manage_documents',
    'upload_documents',
    'delete_documents',
    'manage_news',
    'create_news',
    'delete_news',
    'manage_projects',
    'approve_projects',
    'manage_polls',
    'create_polls',
    'close_polls',
    'manage_proposals',
    'respond_proposals',
    'send_official_email',
    'view_audit_logs',
    'download_backup',
    'restore_backup',
  ],
  secretario: [
    'manage_sessions',
    'create_sessions',
    'sync_calendar',
    'manage_documents',
    'upload_documents',
    'publish_acts',
    'manage_consejeros',
    'manage_news',
    'create_news',
    'manage_proposals',
    'respond_proposals',
    'send_official_email',
    'view_audit_logs',
  ],
  presidente: [
    'manage_sessions',
    'create_sessions',
    'call_sessions',
    'approve_documents',
    'sign_acts',
    'manage_news',
    'create_news',
    'manage_projects',
    'approve_projects',
    'manage_polls',
  ],
  vicepresidente: [
    'manage_sessions',
    'call_sessions',
    'manage_news',
    'create_news',
    'manage_projects',
  ],
  consejero: [
    'view_internal_documents',
    'propose_projects',
    'participate_internal_votes',
    'edit_own_profile',
    'submit_initiatives',
    'view_private_sessions',
    'sync_calendar',
  ],
  ciudadano: [
    'submit_proposal',
    'vote_public_poll',
    'view_public_documents',
    'send_contact_message',
  ],
};

// Interfaces for DB
interface DatabaseSchema {
  users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    status: 'active' | 'suspended';
    sector?: string;
    politicalParty?: string;
    commissionId?: string;
    avatarUrl?: string;
    photoUrl?: string;
    bio?: string;
    socialLinks?: any;
    phone?: string;
    registrationCode?: string;
    createdAt: string;
    isSuperAdmin?: boolean;
  }>;
  consejeros: any[];
  commissions: any[];
  news: any[];
  documents: any[];
  sessions: any[];
  projects: any[];
  activities: any[];
  citizenProposals: any[];
  polls: any[];
  commitments: any[];
  internalVotes: any[];
  socialOversight: any[];
  trainingResources: any[];
  partners: any[];
}

// Initial Seed with ONLY official Admin account
function getInitialSeed(): DatabaseSchema {
  // Trujillo Gordillo: Secretario-cmj-2008
  const adminHash = '$2b$10$RvT2oIP1YfEWnH9Gv.fcHufY.1n.zpV.l0d1si5Aer92t3MFHjN7q';

  return {
    users: [
      {
        id: 'usr_trujillo_admin',
        name: 'Secretario Trujillo Gordillo',
        email: ADMIN_EMAIL,
        passwordHash: adminHash,
        role: 'admin',
        status: 'active',
        isSuperAdmin: true,
        sector: 'Mesa Directiva',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ],
    consejeros: [
      {
        id: 'cons_trujillo_01',
        name: 'Trujillo Gordillo',
        roleTitle: 'Secretario General del CMJ',
        isMesaDirectiva: true,
        mesaDirectivaPosition: 'Secretario General',
        representationSector: 'Mesa Directiva y Coordinación General',
        partyOrOrgName: 'Consejo Municipal de Juventud de Flandes',
        commissionId: 'com_01',
        commissionName: 'Mesa Directiva y Gestión Documental',
        bio: 'Secretario General del Consejo Municipal de Juventud de Flandes (Tolima). Administrador de la plataforma institucional, encargado de la custodia y publicación de actas, convocatorias, archivo público y vinculación de consejeros.',
        functions: [
          'Elaborar, custodiar y publicar las actas oficiales de sesiones plenarias.',
          'Gestionar las convocatorias institucionales y el calendario de trabajo del CMJ.',
          'Administrar la plataforma web y la acreditación de consejeros juveniles.',
          'Canalizar la correspondencia oficial y las propuestas de la juventud de Flandes.',
        ],
        initiatives: [],
        projects: [],
        photoUrl: '',
        contactEmail: ADMIN_EMAIL,
        period: '2024 - 2026',
        status: 'Activo',
        order: 1,
      },
    ],
    commissions: [
      {
        id: 'com_01',
        name: 'Comisión de Educación, Ciencia, Tecnología y Cultura',
        slug: 'educacion-cultura',
        icon: 'BookOpen',
        color: 'amber',
        description: 'Comisión encargada del seguimiento al acceso a educación superior, becas, conectividad digital, arte, patrimonio cultural y juventudes creativas de Flandes.',
        objectives: [
          'Articular convenios educativos para subsidios y transporte estudiantil Flandes - Girardot - Ibagué.',
          'Fomentar las expresiones artísticas, música, danza y rescate cultural ribereño.',
          'Promover aulas digitales y conectividad en veredas y barrios vulnerables.',
        ],
        coordinador: 'Por designar en plenaria',
        secretary: 'Por designar en plenaria',
        membersCount: 0,
        activeProjectsCount: 0,
      },
      {
        id: 'com_02',
        name: 'Comisión de Medio Ambiente, Desarrollo Rural y Cuenca del Río Magdalena',
        slug: 'ambiente-rural',
        icon: 'Leaf',
        color: 'emerald',
        description: 'Comisión encargada de la defensa de los ecosistemas del Río Magdalena, gestión del agua, reciclaje comunitario y fortalecimiento de las veredas de Flandes.',
        objectives: [
          'Veeduría al cuidado hídrico y ambiental de la ribera del Río Magdalena.',
          'Apoyo a proyectos productivos de jóvenes campesinos en veredas flamencas.',
          'Campañas de arborización y educación ambiental escolar.',
        ],
        coordinador: 'Por designar en plenaria',
        secretary: 'Por designar en plenaria',
        membersCount: 0,
        activeProjectsCount: 0,
      },
      {
        id: 'com_03',
        name: 'Comisión de Salud Integral, Deporte y Recreación',
        slug: 'salud-deporte',
        icon: 'HeartPulse',
        color: 'rose',
        description: 'Comisión dedicada a la salud mental juvenil, prevención de adicciones, salud sexual y reproductiva, y fomento de escuelas deportivas.',
        objectives: [
          'Impulsar la política de salud mental y líneas de atención psicológica gratuita para jóvenes.',
          'Recuperación y mantenimiento de polideportivos y parques en Flandes.',
          'Torneos intercolegiados y festivales de deportes alternativos.',
        ],
        coordinador: 'Por designar en plenaria',
        secretary: 'Por designar en plenaria',
        membersCount: 0,
        activeProjectsCount: 0,
      },
      {
        id: 'com_04',
        name: 'Comisión de Emprendimiento, Empleo y Desarrollo Económico',
        slug: 'emprendimiento-empleo',
        icon: 'Briefcase',
        color: 'blue',
        description: 'Comisión para la generación de oportunidades económicas, formación técnica con el SENA y apoyo a emprendedores jóvenes flamencos.',
        objectives: [
          'Ferias municipales de emprendimiento e innovación juvenil.',
          'Alianzas institucionales para el primer empleo juvenil en la región.',
          'Capacitación en marketing digital, finanzas personales y comercio electrónico.',
        ],
        coordinador: 'Por designar en plenaria',
        secretary: 'Por designar en plenaria',
        membersCount: 0,
        activeProjectsCount: 0,
      },
      {
        id: 'com_05',
        name: 'Comisión de Derechos Humanos, Paz y Participación Ciudadana',
        slug: 'derechos-paz',
        icon: 'ShieldCheck',
        color: 'red',
        description: 'Comisión rectora de la veeduría juvenil, garantías democráticas, no estigmatización y articulación con víctimas del conflicto.',
        objectives: [
          'Garantizar el ejercicio libre del liderazgo juvenil y la participación ciudadana.',
          'Mesas de diálogo social y resolución pacífica de conflictos barriales.',
          'Veeduría al cumplimiento del Estatuto de Ciudadanía Juvenil (Ley 1622/1885).',
        ],
        coordinador: 'Por designar en plenaria',
        secretary: 'Por designar en plenaria',
        membersCount: 0,
        activeProjectsCount: 0,
      },
    ],
    news: [],
    documents: [],
    sessions: [],
    projects: [],
    activities: [],
    citizenProposals: [],
    polls: [],
    commitments: [],
    internalVotes: [],
    socialOversight: [],
    trainingResources: [
      {
        id: 'train_01',
        title: 'Ley Estatutaria de Ciudadanía Juvenil (Leyes 1622 de 2013 y 1885 de 2018)',
        category: 'Marco Normativo',
        description: 'Estatuto normativo que reglamenta el funcionamiento, competencias y deberes de los Consejos Municipales de Juventud en Colombia.',
        format: 'PDF Oficial',
        url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53066',
      },
      {
        id: 'train_02',
        title: 'Guía para la Concertación de la Agenda Municipal de Juventud',
        category: 'Gestión Pública',
        description: 'Manual metodológico de Colombia Joven para la formulación participativa de políticas públicas de juventud a nivel territorial.',
        format: 'Guía Técnica',
        url: 'https://colombiajoven.gov.co',
      },
    ],
    partners: [
      {
        id: 'part_01',
        name: 'Alcaldía Municipal de Flandes',
        role: 'Entidad Territorial y Enlace Administrativo',
        website: 'https://www.flandes-tolima.gov.co/',
      },
      {
        id: 'part_02',
        name: 'Concejo Municipal de Flandes',
        role: 'Corporación Pública Coadministradora',
        website: 'https://concejo-flandes-tolima.gov.co/',
      },
      {
        id: 'part_03',
        name: 'Gobernación del Tolima - Dirección de Juventud',
        role: 'Gobierno Departamental',
        website: 'https://www.tolima.gov.co/',
      },
      {
        id: 'part_04',
        name: 'Colombia Joven - Consejería Presidencial para la Juventud',
        role: 'Sistema Nacional de Juventudes',
        website: 'https://colombiajoven.gov.co',
      },
    ],
  };
}

// Database helper functions with atomic writes
function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const seed = getInitialSeed();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Ensure admin user exists with current credentials
    const adminExists = parsed.users.some((u: any) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (!adminExists) {
      parsed.users.unshift(getInitialSeed().users[0]);
      writeDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading db.json, returning initial seed:', err);
    return getInitialSeed();
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

function logAudit(userEmail: string, userName: string, action: string, targetResource: string, details: string, ip?: string): void {
  try {
    let logs: any[] = [];
    if (fs.existsSync(AUDIT_LOGS_FILE)) {
      try {
        logs = JSON.parse(fs.readFileSync(AUDIT_LOGS_FILE, 'utf-8'));
      } catch (e) {
        logs = [];
      }
    }
    const entry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      userEmail,
      userName,
      action,
      targetResource,
      details,
      ipAddress: ip || '127.0.0.1',
    };
    logs.unshift(entry);
    if (logs.length > 500) logs = logs.slice(0, 500);
    fs.writeFileSync(AUDIT_LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error logging audit:', err);
  }
}

function getAuditLogs(): any[] {
  try {
    if (fs.existsSync(AUDIT_LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(AUDIT_LOGS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

// Initialize on start
readDb();

// Authentication Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    isSuperAdmin?: boolean;
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Sesión expirada o token inválido.' });
    }
    req.user = user;
    next();
  });
}

function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }
    if (req.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user.role === 'admin') {
      return next(); // Full super admin bypass
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes los permisos requeridos para esta acción institucional.' });
    }
    next();
  };
}

// ==========================================
// API ROUTES
// ==========================================

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Consejo Municipal de Juventud Flandes API',
    database: 'Cloud SQL PostgreSQL + Persistent JSON Cache',
    adminAccount: ADMIN_EMAIL,
    timestamp: new Date().toISOString(),
  });
});

// Roles and Permissions Directory
app.get('/api/auth/roles', (req, res) => {
  res.json({
    roles: Object.keys(SYSTEM_ROLE_PERMISSIONS),
    permissions: SYSTEM_ROLE_PERMISSIONS,
  });
});

// Maps Config
app.get('/api/maps/config', (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  res.json({ apiKey });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Debe ingresar correo electrónico y contraseña.' });
  }

  const db = readDb();
  const normalizedEmail = email.toLowerCase().trim();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(401).json({
      error: 'Usuario no registrado. Si eres consejero(a), regístrate con el código institucional cmj-flandes.',
    });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Esta cuenta institucional se encuentra suspendida.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Contraseña incorrecta. Verifique sus credenciales.' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    },
    JWT_SECRET,
    { expiresIn: '72h' }
  );

  logAudit(user.email, user.name, 'LOGIN', 'auth', 'Inicio de sesión exitoso en el portal institucional', req.ip);

  const { passwordHash, ...userWithoutPassword } = user;
  const userPermissions = SYSTEM_ROLE_PERMISSIONS[user.role] || [];

  res.json({
    token,
    user: {
      ...userWithoutPassword,
      permissions: userPermissions,
    },
  });
});

// Consejero Self-Registration with Code
app.post('/api/auth/register-with-code', async (req, res) => {
  const { name, email, password, code, politicalParty, bio, photoUrl, socialLinks, phone, commissionId } = req.body;

  if (!code || code.trim().toLowerCase() !== REGISTRATION_CODE) {
    return res.status(400).json({
      error: `Código de registro institucional inválido. Para crear tu cuenta debes ingresar el código oficial (${REGISTRATION_CODE}) suministrado por la Secretaría General.`,
    });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'El nombre completo es obligatorio.' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Debe ingresar un correo electrónico válido.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  const db = readDb();
  const normalizedEmail = email.toLowerCase().trim();

  if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(400).json({ error: 'Ya existe una cuenta registrada con este correo electrónico.' });
  }

  const userId = `usr_cons_${Date.now()}`;
  const consejeroId = `cons_${Date.now()}`;
  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser = {
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'consejero',
    status: 'active' as const,
    sector: politicalParty || 'Listas Independientes',
    politicalParty: politicalParty || 'Consejero Electo CMJ Flandes',
    bio: bio || '',
    photoUrl: photoUrl || '',
    socialLinks: socialLinks || {},
    phone: phone || '',
    registrationCode: REGISTRATION_CODE,
    createdAt: new Date().toISOString(),
    isSuperAdmin: false,
  };

  // Find target commission
  const targetComm = db.commissions.find(c => c.id === commissionId) || db.commissions[0];

  const newConsejeroProfile = {
    id: consejeroId,
    userId,
    name: name.trim(),
    roleTitle: 'Consejero Municipal de Juventud',
    isMesaDirectiva: false,
    representationSector: politicalParty || 'Listas Independientes',
    partyOrOrgName: politicalParty || 'Consejero Electo CMJ Flandes',
    commissionId: targetComm ? targetComm.id : 'com_01',
    commissionName: targetComm ? targetComm.name : 'Comisión de Educación, Ciencia, Tecnología y Cultura',
    bio: bio || 'Consejero Municipal de Juventud de Flandes (Tolima), periodo institucional 2024 - 2026.',
    functions: [
      'Participar con voz y voto en las sesiones plenarias ordinarias y extraordinarias del CMJ Flandes.',
      'Proponer proyectos de acuerdo e iniciativas para el bienestar integral de las juventudes flamencas.',
      'Hacer control social y veeduría a las políticas públicas y presupuestos juveniles del municipio.',
      'Integrar y coordinar mesas de trabajo en barrios y veredas del territorio.',
    ],
    initiatives: [],
    projects: [],
    photoUrl: photoUrl || '',
    contactEmail: normalizedEmail,
    phone: phone || '',
    socialLinks: socialLinks || {},
    period: '2024 - 2026',
    status: 'Activo',
    order: db.consejeros.length + 1,
  };

  db.users.push(newUser);
  db.consejeros.push(newConsejeroProfile);
  writeDb(db);

  // Sync to Cloud SQL PostgreSQL if available
  try {
    if (process.env.SQL_HOST) {
      await pgDb.insert(pgUsers).values({
        uid: userId,
        email: normalizedEmail,
        name: name.trim(),
        passwordHash,
        role: 'consejero',
        status: 'active',
        registrationCode: REGISTRATION_CODE,
        politicalParty: politicalParty || '',
        bio: bio || '',
        photoUrl: photoUrl || '',
        socialLinks: JSON.stringify(socialLinks || {}),
        phone: phone || '',
        isSuperAdmin: 'false',
      }).onConflictDoNothing();
    }
  } catch (dbErr) {
    console.error('PostgreSQL background sync note:', dbErr);
  }

  logAudit(normalizedEmail, name, 'REGISTER_WITH_CODE', 'auth', `Consejero registrado con código ${REGISTRATION_CODE}`, req.ip);

  const token = jwt.sign(
    {
      id: userId,
      email: normalizedEmail,
      role: 'consejero',
      name: name.trim(),
      isSuperAdmin: false,
    },
    JWT_SECRET,
    { expiresIn: '72h' }
  );

  const { passwordHash: _, ...userWithoutPassword } = newUser;
  const userPermissions = SYSTEM_ROLE_PERMISSIONS['consejero'] || [];

  res.status(201).json({
    message: 'Cuenta de consejero creada exitosamente.',
    token,
    user: {
      ...userWithoutPassword,
      permissions: userPermissions,
    },
    consejero: newConsejeroProfile,
  });
});

// Auth Me
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.user?.id || u.email.toLowerCase() === req.user?.email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }
  const { passwordHash, ...userWithoutPassword } = user;
  const userPermissions = SYSTEM_ROLE_PERMISSIONS[user.role] || [];
  res.json({
    user: {
      ...userWithoutPassword,
      permissions: userPermissions,
    },
  });
});

// Change Password
app.post('/api/auth/change-password', authenticateToken, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener mínimo 6 caracteres.' });
  }

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === req.user?.id);
  if (userIndex === -1) return res.status(404).json({ error: 'Usuario no encontrado.' });

  const user = db.users[userIndex];
  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'La contraseña actual no es correcta.' });
  }

  db.users[userIndex].passwordHash = bcrypt.hashSync(newPassword, 10);
  writeDb(db);
  logAudit(user.email, user.name, 'CHANGE_PASSWORD', 'users', 'Cambio de contraseña efectuado', req.ip);

  res.json({ message: 'Contraseña actualizada correctamente.' });
});

// Public Stats
app.get('/api/public/stats', (req, res) => {
  const db = readDb();
  res.json({
    consejerosCount: db.consejeros.length,
    sessionsCount: db.sessions.length,
    documentsCount: db.documents.length,
    projectsCount: db.projects.length,
    newsCount: db.news.length,
    citizenProposalsCount: db.citizenProposals.length,
    totalPollVotes: db.polls.reduce((acc, p) => acc + (p.totalVotes || 0), 0),
  });
});

// Consejeros Directory
app.get('/api/consejeros', (req, res) => {
  const db = readDb();
  const sorted = [...db.consejeros].sort((a, b) => (a.order || 99) - (b.order || 99));
  res.json(sorted);
});

app.post('/api/consejeros', authenticateToken, requireRole(['admin', 'secretario', 'presidente']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newConsejero = {
    ...req.body,
    id: `cons_${Date.now()}`,
    order: db.consejeros.length + 1,
  };
  db.consejeros.push(newConsejero);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'CREATE', 'consejeros', `Creó perfil de consejero: ${newConsejero.name}`, req.ip);
  res.status(201).json(newConsejero);
});

app.put('/api/consejeros/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDb();
  const index = db.consejeros.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Consejero no encontrado.' });

  // Consejeros can only edit their own profile unless admin/secretario
  const existing = db.consejeros[index];
  const isOwner = existing.userId === req.user?.id || existing.contactEmail?.toLowerCase() === req.user?.email.toLowerCase();
  const isAdmin = req.user?.role === 'admin' || req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Solo puedes editar tu propio perfil de consejero.' });
  }

  db.consejeros[index] = { ...db.consejeros[index], ...req.body };
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'UPDATE', 'consejeros', `Actualizó consejero: ${db.consejeros[index].name}`, req.ip);
  res.json(db.consejeros[index]);
});

app.delete('/api/consejeros/:id', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const item = db.consejeros.find(c => c.id === req.params.id);
  db.consejeros = db.consejeros.filter(c => c.id !== req.params.id);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'DELETE', 'consejeros', `Eliminó consejero: ${item?.name || req.params.id}`, req.ip);
  res.json({ message: 'Perfil de consejero eliminado correctamente.' });
});

// Commissions
app.get('/api/commissions', (req, res) => {
  const db = readDb();
  res.json(db.commissions);
});

// News
app.get('/api/news', (req, res) => {
  const db = readDb();
  const publishedOnly = req.query.all !== 'true';
  let list = db.news;
  if (publishedOnly) {
    list = list.filter(n => n.status === 'published');
  }
  list = [...list].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  res.json(list);
});

app.post('/api/news', authenticateToken, requireRole(['admin', 'secretario', 'presidente']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newArticle = {
    ...req.body,
    id: `news_${Date.now()}`,
    slug: req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `noticia-${Date.now()}`,
    publishedAt: req.body.publishedAt || new Date().toISOString(),
    author: req.body.author || req.user!.name,
    status: req.body.status || 'published',
  };
  db.news.unshift(newArticle);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'CREATE', 'news', `Publicó noticia: ${newArticle.title}`, req.ip);
  res.status(201).json(newArticle);
});

app.delete('/api/news/:id', authenticateToken, requireRole(['admin', 'secretario']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  db.news = db.news.filter(n => n.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Noticia eliminada.' });
});

// Official Documents & Acts
app.get('/api/documents', (req, res) => {
  const db = readDb();
  const category = req.query.category as string;
  let list = db.documents;
  if (category) {
    list = list.filter(d => d.category === category);
  }
  list = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(list);
});

app.post('/api/documents', authenticateToken, requireRole(['admin', 'secretario']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newDoc = {
    ...req.body,
    id: `doc_${Date.now()}`,
    radicadoNumber: req.body.radicadoNumber || `ACTA-CMJ-${new Date().getFullYear()}-${String(db.documents.length + 1).padStart(3, '0')}`,
    date: req.body.date || new Date().toISOString().split('T')[0],
    isPublic: true,
  };
  db.documents.unshift(newDoc);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'UPLOAD', 'documents', `Radicó documento: ${newDoc.title}`, req.ip);
  res.status(201).json(newDoc);
});

app.delete('/api/documents/:id', authenticateToken, requireRole(['admin', 'secretario']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  db.documents = db.documents.filter(d => d.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Documento eliminado.' });
});

// Sessions & Google Calendar Sync
app.get('/api/sessions', (req, res) => {
  const db = readDb();
  const sorted = [...db.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(sorted);
});

app.post('/api/sessions', authenticateToken, requireRole(['admin', 'secretario', 'presidente']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newSession = {
    ...req.body,
    id: `ses_${Date.now()}`,
    status: req.body.status || 'Programada',
    sessionNumber: req.body.sessionNumber || `Sesión ${req.body.type || 'Ordinaria'} N° ${db.sessions.length + 1} - ${new Date().getFullYear()}`,
  };
  db.sessions.unshift(newSession);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'CREATE', 'sessions', `Convocó sesión: ${newSession.title}`, req.ip);
  res.status(201).json(newSession);
});

app.delete('/api/sessions/:id', authenticateToken, requireRole(['admin', 'secretario']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  db.sessions = db.sessions.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Sesión eliminada.' });
});

// Google Calendar Sync Info & RFC 5545 iCalendar (.ics) download
app.get('/api/calendar/sessions/:id/ics', (req, res) => {
  const db = readDb();
  const session = db.sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).send('Sesión no encontrada.');

  const startDateStr = session.date.replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Consejo Municipal de Juventud Flandes//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cmj-session-${session.id}@flandes-tolima.gov.co`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startDateStr}T150000Z`,
    `DTEND:${startDateStr}T180000Z`,
    `SUMMARY:CMJ Flandes: ${session.title}`,
    `DESCRIPTION:${(session.agenda || session.orderOfDay || []).toString().replace(/\n/g, '\\n')}`,
    `LOCATION:${session.location || 'Flandes, Tolima'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="sesion-cmj-flandes-${session.id}.ics"`);
  res.send(icsContent);
});

// Projects
app.get('/api/projects', (req, res) => {
  const db = readDb();
  res.json(db.projects);
});

app.post('/api/projects', authenticateToken, requireRole(['admin', 'secretario', 'presidente', 'consejero']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newProj = {
    ...req.body,
    id: `proj_${Date.now()}`,
    code: `PROJ-FL-${new Date().getFullYear()}-${String(db.projects.length + 1).padStart(2, '0')}`,
    leadConsejero: req.body.leadConsejero || req.user!.name,
    status: req.body.status || 'En Formulación',
  };
  db.projects.unshift(newProj);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'CREATE', 'projects', `Presentó proyecto: ${newProj.title}`, req.ip);
  res.status(201).json(newProj);
});

// Activities
app.get('/api/activities', (req, res) => {
  const db = readDb();
  res.json(db.activities);
});

app.post('/api/activities', authenticateToken, requireRole(['admin', 'secretario', 'presidente', 'consejero']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newAct = {
    ...req.body,
    id: `act_${Date.now()}`,
  };
  db.activities.unshift(newAct);
  writeDb(db);
  res.status(201).json(newAct);
});

// Citizen Proposals
app.get('/api/citizen-proposals', (req, res) => {
  const db = readDb();
  res.json(db.citizenProposals);
});

app.post('/api/citizen-proposals', (req, res) => {
  const { fullName, age, neighborhoodOrVereda, email, phone, topic, title, description } = req.body;
  if (!fullName || !email || !title || !description) {
    return res.status(400).json({ error: 'Nombre, correo, título y descripción son obligatorios.' });
  }

  const db = readDb();
  const radicadoCode = `CMJ-FL-${new Date().getFullYear()}-${String(db.citizenProposals.length + 1).padStart(4, '0')}`;
  const newProposal = {
    id: `cit_${Date.now()}`,
    radicadoCode,
    fullName,
    age: age || null,
    neighborhoodOrVereda: neighborhoodOrVereda || '',
    email,
    phone: phone || '',
    topic: topic || 'General',
    title,
    description,
    createdAt: new Date().toISOString(),
    status: 'Recibido',
    assignedCommission: 'Comisión de Juventudes',
  };

  db.citizenProposals.unshift(newProposal);
  writeDb(db);

  logAudit(email, fullName, 'SUBMIT_PROPOSAL', 'citizenProposals', `Propuesta ciudadana radicada: ${radicadoCode}`, req.ip);

  res.status(201).json({
    message: 'Propuesta ciudadana radicada con éxito en el Consejo Municipal de Juventud de Flandes.',
    radicadoCode,
    proposal: newProposal,
  });
});

app.put('/api/citizen-proposals/:id/status', authenticateToken, requireRole(['admin', 'secretario', 'presidente']), (req: AuthRequest, res: Response) => {
  const { status, officialResponse, assignedCommission } = req.body;
  const db = readDb();
  const idx = db.citizenProposals.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Propuesta no encontrada.' });

  db.citizenProposals[idx] = {
    ...db.citizenProposals[idx],
    status: status || db.citizenProposals[idx].status,
    officialResponse: officialResponse || db.citizenProposals[idx].officialResponse,
    assignedCommission: assignedCommission || db.citizenProposals[idx].assignedCommission,
    responseDate: officialResponse ? new Date().toISOString() : db.citizenProposals[idx].responseDate,
  };

  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'RESPOND_PROPOSAL', 'citizenProposals', `Respondió propuesta: ${db.citizenProposals[idx].radicadoCode}`, req.ip);

  res.json(db.citizenProposals[idx]);
});

// Public Polls
app.get('/api/polls', (req, res) => {
  const db = readDb();
  res.json(db.polls);
});

app.post('/api/polls/:id/vote', (req, res) => {
  const { optionId } = req.body;
  const db = readDb();
  const pollIdx = db.polls.findIndex(p => p.id === req.params.id);
  if (pollIdx === -1) return res.status(404).json({ error: 'Encuesta no encontrada.' });

  const poll = db.polls[pollIdx];
  if (!poll.active) return res.status(400).json({ error: 'Esta encuesta ya ha cerrado sus votaciones.' });

  const option = poll.options.find((o: any) => o.id === optionId);
  if (!option) return res.status(404).json({ error: 'Opción no válida.' });

  option.votes = (option.votes || 0) + 1;
  poll.totalVotes = (poll.totalVotes || 0) + 1;
  writeDb(db);

  res.json({ message: 'Voto registrado con éxito.', poll });
});

app.post('/api/polls', authenticateToken, requireRole(['admin', 'secretario', 'presidente']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newPoll = {
    ...req.body,
    id: `poll_${Date.now()}`,
    totalVotes: 0,
    active: true,
  };
  db.polls.unshift(newPoll);
  writeDb(db);
  res.status(201).json(newPoll);
});

// Gmail Institutional Notification / Dispatch Endpoint
app.post('/api/gmail/send-notification', (req, res) => {
  const { subject, message, senderName, senderEmail, phone } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'Asunto y mensaje son obligatorios.' });
  }

  // Pre-generate web mailto direct link to Secretariat
  const encodedSubj = encodeURIComponent(`[CMJ FLANDES] ${subject}`);
  const encodedBody = encodeURIComponent(
    `De: ${senderName || 'Ciudadano'} (${senderEmail || 'No especificado'})\nTeléfono: ${phone || 'N/A'}\n\nMensaje:\n${message}\n\n---\nEnviado desde el portal institucional del Consejo Municipal de Juventud de Flandes (Tolima)`
  );
  const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${ADMIN_EMAIL}&su=${encodedSubj}&body=${encodedBody}`;

  logAudit(senderEmail || 'ciudadano', senderName || 'Anónimo', 'GMAIL_DISPATCH', 'gmail', `Correspondencia dirigida a ${ADMIN_EMAIL}: ${subject}`, req.ip);

  res.json({
    success: true,
    recipient: ADMIN_EMAIL,
    subject,
    webGmailUrl,
    message: 'Correspondencia preparada para envío oficial a la Secretaría General del CMJ Flandes.',
  });
});

// Private Commitments
app.get('/api/private/commitments', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDb();
  res.json(db.commitments);
});

app.post('/api/private/commitments', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newCommitment = {
    ...req.body,
    id: `com_tsk_${Date.now()}`,
    status: req.body.status || 'Pendiente',
  };
  db.commitments.unshift(newCommitment);
  writeDb(db);
  res.status(201).json(newCommitment);
});

app.put('/api/private/commitments/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDb();
  const idx = db.commitments.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Compromiso no encontrado.' });

  db.commitments[idx] = { ...db.commitments[idx], ...req.body };
  writeDb(db);
  res.json(db.commitments[idx]);
});

// Private Internal Votes
app.get('/api/private/internal-votes', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDb();
  res.json(db.internalVotes);
});

app.post('/api/private/internal-votes/:id/vote', authenticateToken, (req: AuthRequest, res: Response) => {
  const { selectedOption } = req.body;
  const db = readDb();
  const idx = db.internalVotes.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Votación no encontrada.' });

  const voteItem = db.internalVotes[idx];
  const existingIndex = voteItem.votes.findIndex((v: any) => v.consejeroId === req.user!.id);
  const voteRecord = {
    consejeroId: req.user!.id,
    consejeroName: req.user!.name,
    selectedOption,
    votedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    voteItem.votes[existingIndex] = voteRecord;
  } else {
    voteItem.votes.push(voteRecord);
  }

  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'INTERNAL_VOTE', 'internalVotes', `Voto en: ${voteItem.title} -> ${selectedOption}`, req.ip);
  res.json(voteItem);
});

// Social Oversight (Veeduría)
app.get('/api/private/social-oversight', authenticateToken, (req: AuthRequest, res: Response) => {
  const db = readDb();
  res.json(db.socialOversight);
});

app.post('/api/private/social-oversight', authenticateToken, requireRole(['admin', 'secretario', 'presidente', 'consejero']), (req: AuthRequest, res: Response) => {
  const db = readDb();
  const newOversight = {
    ...req.body,
    id: `ovs_${Date.now()}`,
  };
  db.socialOversight.unshift(newOversight);
  writeDb(db);
  res.status(201).json(newOversight);
});

// Training Resources & Partners
app.get('/api/training', (req, res) => {
  const db = readDb();
  res.json(db.trainingResources);
});

app.get('/api/partners', (req, res) => {
  const db = readDb();
  res.json(db.partners);
});

// ADMIN: User Management (Strictly restricted to ADMIN_EMAIL / isSuperAdmin)
app.get('/api/admin/users', authenticateToken, (req: AuthRequest, res: Response) => {
  const isSuper = req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user?.isSuperAdmin;
  if (!isSuper) {
    return res.status(403).json({ error: 'Solo la cuenta del Administrador Principal tiene acceso a la gestión de usuarios.' });
  }

  const db = readDb();
  const safeUsers = db.users.map(({ passwordHash, ...rest }) => rest);
  res.json(safeUsers);
});

app.post('/api/admin/users', authenticateToken, (req: AuthRequest, res: Response) => {
  // USER MANDATE: "yo soy el unico de crear cuentas"
  const isSuper = req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user?.isSuperAdmin;
  if (!isSuper) {
    return res.status(403).json({
      error: 'Acceso denegado: Únicamente la Secretaría General (trujillogordilooo@gmail.com) está facultada para crear cuentas directamente.',
    });
  }

  const { name, email, password, role, sector, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
  }

  const db = readDb();
  const normalizedEmail = email.toLowerCase().trim();
  if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(400).json({ error: 'Ya existe un usuario con este correo electrónico.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email: normalizedEmail,
    passwordHash: bcrypt.hashSync(password, 10),
    role: role || 'consejero',
    status: 'active' as const,
    sector: sector || 'Mesa Directiva',
    phone: phone || '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'CREATE_USER', 'users', `Creó usuario: ${newUser.email} (${newUser.role})`, req.ip);

  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.put('/api/admin/users/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const isSuper = req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user?.isSuperAdmin;
  if (!isSuper) {
    return res.status(403).json({ error: 'Solo la Secretaría General puede modificar cuentas de usuario.' });
  }

  const db = readDb();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado.' });

  const existing = db.users[index];
  const { password, ...otherUpdates } = req.body;

  if (password && password.length >= 6) {
    existing.passwordHash = bcrypt.hashSync(password, 10);
  }

  db.users[index] = { ...existing, ...otherUpdates };
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'UPDATE_USER', 'users', `Actualizó usuario: ${existing.email}`, req.ip);

  const { passwordHash, ...safeUser } = db.users[index];
  res.json(safeUser);
});

app.delete('/api/admin/users/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const isSuper = req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user?.isSuperAdmin;
  if (!isSuper) {
    return res.status(403).json({ error: 'Solo la Secretaría General puede eliminar cuentas de usuario.' });
  }

  const db = readDb();
  const target = db.users.find(u => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado.' });

  if (target.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || target.isSuperAdmin) {
    return res.status(403).json({ error: 'La cuenta del Administrador Principal está protegida institucionalmente contra eliminación.' });
  }

  db.users = db.users.filter(u => u.id !== req.params.id);
  writeDb(db);
  logAudit(req.user!.email, req.user!.name, 'DELETE_USER', 'users', `Eliminó usuario: ${target.email}`, req.ip);

  res.json({ message: 'Usuario eliminado exitosamente.' });
});

// ADMIN: Audit Logs
app.get('/api/admin/audit-logs', authenticateToken, (req: AuthRequest, res: Response) => {
  const isSuper = req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user?.isSuperAdmin;
  if (!isSuper) return res.status(403).json({ error: 'Acceso denegado a registros de auditoría.' });
  res.json(getAuditLogs());
});

// ADMIN: Backup & Restore
app.get('/api/admin/backup', authenticateToken, (req: AuthRequest, res: Response) => {
  const isSuper = req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user?.isSuperAdmin;
  if (!isSuper) return res.status(403).json({ error: 'Acceso denegado a copias de seguridad.' });

  const db = readDb();
  logAudit(req.user!.email, req.user!.name, 'EXPORT_BACKUP', 'system', 'Generó copia de seguridad del sistema', req.ip);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="backup-cmj-flandes-${new Date().toISOString().split('T')[0]}.json"`);
  res.json({
    app: 'Consejo Municipal de Juventud Flandes',
    exportedAt: new Date().toISOString(),
    exportedBy: req.user!.email,
    database: db,
  });
});

app.post('/api/admin/restore', authenticateToken, (req: AuthRequest, res: Response) => {
  const isSuper = req.user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user?.isSuperAdmin;
  if (!isSuper) return res.status(403).json({ error: 'Acceso denegado.' });

  const { database } = req.body;
  if (!database || !Array.isArray(database.users)) {
    return res.status(400).json({ error: 'Formato de archivo de respaldo inválido.' });
  }

  writeDb(database);
  logAudit(req.user!.email, req.user!.name, 'RESTORE_BACKUP', 'system', 'Restauró base de datos desde copia de seguridad', req.ip);
  res.json({ message: 'Base de datos restaurada correctamente.' });
});

// Vite Integration & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CMJ Flandes] Servidor institucional ejecutándose en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
