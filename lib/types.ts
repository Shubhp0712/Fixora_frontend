// Type definitions for Fixora Dashboard

export type TicketCategory = 'hardware' | 'software' | 'network' | 'access' | 'email' | 'printer' | 'account' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed' | 'cancelled';
export type UserRole = 'employee' | 'admin' | 'it_support' | 'manager';

export interface User {
    id: number;
    email: string;
    full_name: string;
    teams_user_id?: string;
    department?: string;
    role: UserRole;
    is_active: boolean;
    phone?: string;
    created_at: string;
    updated_at: string;
}

export interface Ticket {
    id: number;
    ticket_number: string;
    user_id: number;
    assigned_to_id?: number;
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    ai_classification?: string;
    ai_confidence?: number;
    sla_deadline?: string;
    resolved_at?: string;
    closed_at?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    assigned_to?: User;
}

export interface TicketActivity {
    id: number;
    ticket_id: number;
    user_id: number;
    activity_type: string;
    description: string;
    old_value?: string;
    new_value?: string;
    created_at: string;
    user?: User;
}

export interface KnowledgeBase {
    id: number;
    title: string;
    question: string;
    answer: string;
    category: TicketCategory;
    keywords?: string[];
    view_count: number;
    helpful_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Attachment {
    id: number;
    ticket_id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    uploaded_at: string;
}

export interface DashboardStats {
    total_tickets: number;
    open_tickets: number;
    in_progress_tickets: number;
    resolved_today: number;
    average_resolution_hours: number;
}

export interface TicketCreate {
    title: string;
    description: string;
    category: TicketCategory;
    priority?: TicketPriority;
}

export interface TicketUpdate {
    title?: string;
    description?: string;
    category?: TicketCategory;
    priority?: TicketPriority;
    status?: TicketStatus;
    assigned_to_id?: number;
}

export interface TicketComment {
    ticket_id: number;
    comment: string;
}

export interface PaginatedResponse<T> {
    tickets?: T[];
    users?: T[];
    articles?: T[];
    total: number;
    page: number;
    page_size: number;
}
