import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (system accounts & authentication)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or internal unique identifier
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('consejero'), // admin, secretario, presidente, vicepresidente, consejero, ciudadano
  status: text('status').notNull().default('active'),
  registrationCode: text('registration_code'),
  politicalParty: text('political_party'),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  socialLinks: text('social_links'), // JSON serialized
  phone: text('phone'),
  commissionId: text('commission_id'),
  isSuperAdmin: text('is_super_admin').default('false'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Consejeros profile directory
export const consejeros = pgTable('consejeros', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull(), // Presidente, Vicepresidente, Secretario, Consejero
  party: text('party'),
  commission: text('commission'),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  socialLinks: text('social_links'),
  initiatives: text('initiatives'),
  activities: text('activities'),
  createdAt: timestamp('created_at').defaultNow(),
});

// CMJ Sessions
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull().default('ordinaria'), // ordinaria, extraordinaria, solemne
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  agenda: text('agenda').notNull(),
  status: text('status').notNull().default('scheduled'), // scheduled, completed, cancelled
  documentUrl: text('document_url'),
  googleCalendarEventId: text('google_calendar_event_id'),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Official Documents & Acts
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // acta, resolucion, estatuto, informe
  code: text('code').notNull(),
  date: text('date').notNull(),
  description: text('description'),
  fileUrl: text('file_url'),
  uploadedBy: text('uploaded_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Citizen Proposals
export const citizenProposals = pgTable('citizen_proposals', {
  id: serial('id').primaryKey(),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  neighborhood: text('neighborhood'),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull().default('received'), // received, in_review, prioritized, approved
  createdAt: timestamp('created_at').defaultNow(),
});

// Youth Polls
export const polls = pgTable('polls', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  options: text('options').notNull(), // JSON string
  votes: text('votes').notNull().default('{}'), // JSON string
  isOpen: text('is_open').notNull().default('true'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  consejeros: many(consejeros),
}));

export const consejerosRelations = relations(consejeros, ({ one }) => ({
  user: one(users, {
    fields: [consejeros.userId],
    references: [users.id],
  }),
}));
