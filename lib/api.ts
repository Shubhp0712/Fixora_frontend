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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ticket APIs
export async function fetchTickets(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    page?: number;
    per_page?: number;
}): Promise<PaginatedResponse<Ticket>> {
    const response = await apiClient.get('/tickets/', { params: filters });
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

export async function fetchUserTickets(userId: number): Promise<Ticket[]> {
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
    per_page?: number;
}): Promise<PaginatedResponse<KnowledgeBase>> {
    const response = await apiClient.get('/kb/', { params: filters });
    return response.data;
}

export async function searchKB(query: string): Promise<KnowledgeBase[]> {
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
export async function fetchUsers(): Promise<User[]> {
    const response = await apiClient.get('/users/');
    return response.data;
}

export async function fetchUser(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
}

export default apiClient;
