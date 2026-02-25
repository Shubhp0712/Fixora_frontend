// Utility functions for Fixora Dashboard
import { TicketPriority, TicketStatus, TicketCategory } from './types';

// Format date to readable string
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Format date with time
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Get priority badge color
export function getPriorityColor(priority: TicketPriority): string {
    const colors = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors.medium;
}

// Get status badge color
export function getStatusColor(status: TicketStatus): string {
    const colors = {
        open: 'bg-green-100 text-green-800',
        in_progress: 'bg-blue-100 text-blue-800',
        waiting_on_user: 'bg-yellow-100 text-yellow-800',
        resolved: 'bg-purple-100 text-purple-800',
        closed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.open;
}

// Get category icon
export function getCategoryIcon(category: TicketCategory): string {
    const icons = {
        hardware: '🖥️',
        software: '💻',
        network: '🌐',
        access: '🔑',
        email: '📧',
        printer: '🖨️',
        account: '👤',
        other: '📝',
    };
    return icons[category] || icons.other;
}

// Format category name
export function formatCategoryName(category: TicketCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Format status name
export function formatStatusName(status: TicketStatus): string {
    return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Format priority name
export function formatPriorityName(priority: TicketPriority): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

// Calculate time difference
export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }

    return 'just now';
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}
