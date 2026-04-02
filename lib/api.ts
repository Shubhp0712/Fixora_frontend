// API client for Fixora Backend
import axios from 'axios';
import {
    Ticket,
    TicketCreate,
    TicketUpdate,
    TicketComment,
    KnowledgeBase,
    DashboardStats,
    User,
    TicketActivity,
    PaginatedResponse
} from './types';
import { getSession } from './session';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const session = getSession();
            if (session?.token) {
                config.headers.Authorization = `Bearer ${session.token}`;
            }
            if (session?.user.organizationId) {
                config.headers['X-Organization-Id'] = session.user.organizationId;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (typeof window !== 'undefined' && (status === 401 || status === 403)) {
            window.dispatchEvent(new CustomEvent('fixora:auth-error'));
        }
        return Promise.reject(error);
    }
);

// Ticket APIs
export async function fetchTickets(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    page?: number;
    page_size?: number;
}): Promise<{ tickets: Ticket[]; total: number; page: number; page_size: number }> {
    // Remove empty string values from params - backend rejects them with 422
    const cleanParams: Record<string, any> = {};
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            // Only include the param if it's not an empty string
            if (value !== '' && value !== null && value !== undefined) {
                cleanParams[key] = value;
            }
        });
    }
    const response = await apiClient.get('/tickets/', { params: cleanParams });
    return response.data;
}

export async function fetchTicket(id: number): Promise<Ticket> {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
}

export async function createTicket(data: TicketCreate): Promise<Ticket> {
    const response = await apiClient.post('/tickets/', data);
    return response.data;
}

export async function updateTicket(id: number, data: TicketUpdate): Promise<Ticket> {
    const response = await apiClient.patch(`/tickets/${id}`, data);
    return response.data;
}

export async function deleteTicket(id: number): Promise<void> {
    await apiClient.delete(`/tickets/${id}`);
}

export async function addTicketComment(id: number, comment: string): Promise<TicketActivity> {
    const response = await apiClient.post(`/tickets/${id}/comments`, { comment });
    return response.data;
}

export async function updateTicketStatus(id: number, status: string): Promise<Ticket> {
    const response = await apiClient.patch(`/tickets/${id}/status`, { status });
    return response.data;
}

export async function assignTicket(id: number, assigned_to_id: number): Promise<Ticket> {
    const response = await apiClient.patch(`/tickets/${id}/assign`, { assigned_to_id });
    return response.data;
}

export async function fetchUserTickets(userId: number): Promise<{ tickets: Ticket[]; total: number }> {
    const response = await apiClient.get(`/tickets/user/${userId}`);
    return response.data;
}

export async function fetchTicketActivities(ticketId: number): Promise<TicketActivity[]> {
    const response = await apiClient.get(`/tickets/${ticketId}/activities`);
    return response.data;
}

// Knowledge Base APIs
export async function fetchKBArticles(filters?: {
    category?: string;
    page?: number;
    page_size?: number;
}): Promise<{ articles: KnowledgeBase[]; total: number; page: number; page_size: number }> {
    const response = await apiClient.get('/kb/', { params: filters });
    return response.data;
}

export async function searchKB(query: string): Promise<{ results: KnowledgeBase[]; total: number }> {
    const response = await apiClient.get('/kb/search', { params: { q: query } });
    return response.data;
}

export async function fetchKBArticle(id: number): Promise<KnowledgeBase> {
    const response = await apiClient.get(`/kb/${id}`);
    return response.data;
}

export async function createKBArticle(data: Partial<KnowledgeBase>): Promise<KnowledgeBase> {
    const response = await apiClient.post('/kb/', data);
    return response.data;
}

export async function updateKBArticle(id: number, data: Partial<KnowledgeBase>): Promise<KnowledgeBase> {
    const response = await apiClient.patch(`/kb/${id}`, data);
    return response.data;
}

export async function markKBHelpful(id: number): Promise<void> {
    await apiClient.post(`/kb/${id}/helpful`);
}

// Dashboard/Metrics APIs
export async function fetchDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/metrics/dashboard');
    return response.data;
}

// User APIs
export async function fetchUsers(filters?: {
    role?: string;
    page?: number;
    page_size?: number;
}): Promise<{ users: User[]; total: number; page: number; page_size: number }> {
    const response = await apiClient.get('/users/', { params: filters });
    return response.data;
}

export async function fetchUser(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
}

export default apiClient;
