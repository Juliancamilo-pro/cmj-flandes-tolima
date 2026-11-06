/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  ConsejeroProfile,
  Commission,
  NewsArticle,
  DocumentItem,
  CouncilSession,
  YouthProject,
  YouthActivity,
  CitizenProposal,
  PublicPoll,
  CommitmentTask,
  InternalVote,
  SocialOversightRecord,
  TrainingResource,
  InstitutionalPartner,
  AuditLogEntry,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('cmj_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Error en la petición al servidor' }));
    throw new Error(errorData.error || `Error HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async registerWithCode(data: {
    name: string;
    email: string;
    password: string;
    code: string;
    politicalParty?: string;
    bio?: string;
    photoUrl?: string;
    socialLinks?: any;
    phone?: string;
    commissionId?: string;
  }): Promise<{ token: string; user: User; consejero: ConsejeroProfile; message: string }> {
    const res = await fetch(`${API_BASE}/auth/register-with-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async sendGmailNotification(data: {
    subject: string;
    message: string;
    senderName?: string;
    senderEmail?: string;
    phone?: string;
  }): Promise<{ success: boolean; recipient: string; subject: string; webGmailUrl: string; message: string }> {
    const res = await fetch(`${API_BASE}/gmail/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  downloadSessionIcs(sessionId: string): void {
    window.location.href = `${API_BASE}/calendar/sessions/${sessionId}/ics`;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },

  // Stats
  async getPublicStats(): Promise<{
    consejerosCount: number;
    sessionsCount: number;
    documentsCount: number;
    projectsCount: number;
    newsCount: number;
    citizenProposalsCount: number;
    totalPollVotes: number;
  }> {
    const res = await fetch(`${API_BASE}/public/stats`);
    return handleResponse(res);
  },

  // Consejeros
  async getConsejeros(): Promise<ConsejeroProfile[]> {
    const res = await fetch(`${API_BASE}/consejeros`);
    return handleResponse(res);
  },

  async createConsejero(data: Partial<ConsejeroProfile>): Promise<ConsejeroProfile> {
    const res = await fetch(`${API_BASE}/consejeros`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateConsejero(id: string, data: Partial<ConsejeroProfile>): Promise<ConsejeroProfile> {
    const res = await fetch(`${API_BASE}/consejeros/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteConsejero(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/consejeros/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // News
  async getNews(all: boolean = false): Promise<NewsArticle[]> {
    const res = await fetch(`${API_BASE}/news${all ? '?all=true' : ''}`);
    return handleResponse(res);
  },

  async createNews(data: Partial<NewsArticle>): Promise<NewsArticle> {
    const res = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateNews(id: string, data: Partial<NewsArticle>): Promise<NewsArticle> {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteNews(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Documents
  async getDocuments(category?: string): Promise<DocumentItem[]> {
    const url = category && category !== 'Todas' ? `${API_BASE}/documents?category=${encodeURIComponent(category)}` : `${API_BASE}/documents`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async createDocument(data: Partial<DocumentItem>): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateDocument(id: string, data: Partial<DocumentItem>): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteDocument(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Sessions
  async getSessions(): Promise<CouncilSession[]> {
    const res = await fetch(`${API_BASE}/sessions`);
    return handleResponse(res);
  },

  async createSession(data: Partial<CouncilSession>): Promise<CouncilSession> {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateSession(id: string, data: Partial<CouncilSession>): Promise<CouncilSession> {
    const res = await fetch(`${API_BASE}/sessions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Projects
  async getProjects(): Promise<YouthProject[]> {
    const res = await fetch(`${API_BASE}/projects`);
    return handleResponse(res);
  },

  async createProject(data: Partial<YouthProject>): Promise<YouthProject> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateProject(id: string, data: Partial<YouthProject>): Promise<YouthProject> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Activities
  async getActivities(): Promise<YouthActivity[]> {
    const res = await fetch(`${API_BASE}/activities`);
    return handleResponse(res);
  },

  async createActivity(data: Partial<YouthActivity>): Promise<YouthActivity> {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Commissions
  async getCommissions(): Promise<Commission[]> {
    const res = await fetch(`${API_BASE}/commissions`);
    return handleResponse(res);
  },

  // Citizen Proposals
  async submitCitizenProposal(data: {
    fullName: string;
    age: number;
    neighborhoodOrVereda: string;
    email: string;
    phone: string;
    topic: string;
    title: string;
    description: string;
  }): Promise<{ message: string; radicadoCode: string; proposal: CitizenProposal }> {
    const res = await fetch(`${API_BASE}/citizen-proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async trackCitizenProposal(radicadoCode: string): Promise<CitizenProposal> {
    const res = await fetch(`${API_BASE}/citizen-proposals/track/${encodeURIComponent(radicadoCode)}`);
    return handleResponse(res);
  },

  async getCitizenProposals(): Promise<CitizenProposal[]> {
    const res = await fetch(`${API_BASE}/citizen-proposals`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async respondCitizenProposal(id: string, data: { status: string; officialResponse: string; assignedCommission?: string }): Promise<CitizenProposal> {
    const res = await fetch(`${API_BASE}/citizen-proposals/${id}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Polls
  async getPolls(): Promise<PublicPoll[]> {
    const res = await fetch(`${API_BASE}/polls`);
    return handleResponse(res);
  },

  async votePoll(pollId: string, optionId: string): Promise<{ message: string; poll: PublicPoll }> {
    const res = await fetch(`${API_BASE}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    });
    return handleResponse(res);
  },

  async createPoll(data: Partial<PublicPoll>): Promise<PublicPoll> {
    const res = await fetch(`${API_BASE}/polls`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Commitments
  async getCommitments(): Promise<CommitmentTask[]> {
    const res = await fetch(`${API_BASE}/private/commitments`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createCommitment(data: Partial<CommitmentTask>): Promise<CommitmentTask> {
    const res = await fetch(`${API_BASE}/private/commitments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateCommitment(id: string, data: Partial<CommitmentTask>): Promise<CommitmentTask> {
    const res = await fetch(`${API_BASE}/private/commitments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Internal Votes
  async getInternalVotes(): Promise<InternalVote[]> {
    const res = await fetch(`${API_BASE}/private/internal-votes`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async castInternalVote(voteId: string, selectedOption: string): Promise<InternalVote> {
    const res = await fetch(`${API_BASE}/private/internal-votes/${voteId}/vote`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ selectedOption }),
    });
    return handleResponse(res);
  },

  // Social Oversight
  async getSocialOversight(): Promise<SocialOversightRecord[]> {
    const res = await fetch(`${API_BASE}/private/social-oversight`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createSocialOversight(data: Partial<SocialOversightRecord>): Promise<SocialOversightRecord> {
    const res = await fetch(`${API_BASE}/private/social-oversight`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Training & Partners
  async getTraining(): Promise<TrainingResource[]> {
    const res = await fetch(`${API_BASE}/training`);
    return handleResponse(res);
  },

  async getPartners(): Promise<InstitutionalPartner[]> {
    const res = await fetch(`${API_BASE}/partners`);
    return handleResponse(res);
  },

  // Admin: Users
  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createAdminUser(data: any): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateAdminUser(id: string, data: any): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteAdminUser(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin: Audit Logs & Backup
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getBackupDownload(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/backup`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async restoreBackup(database: any): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ database }),
    });
    return handleResponse(res);
  },
};
