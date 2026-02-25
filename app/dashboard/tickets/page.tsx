'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTickets } from '@/lib/api';
import {
    formatDateTime,
    getStatusColor,
    getPriorityColor,
    getCategoryIcon,
    formatStatusName,
    formatPriorityName,
    formatCategoryName
} from '@/lib/utils';
import Link from 'next/link';
import { TicketCategory, TicketPriority, TicketStatus } from '@/lib/types';

export default function TicketsPage() {
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        page: 1,
        per_page: 10,
    });
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['tickets', filters],
        queryFn: () => fetchTickets(filters),
    });

    const statuses: TicketStatus[] = ['open', 'in_progress', 'waiting_on_user', 'resolved', 'closed', 'cancelled'];
    const priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
    const categories: TicketCategory[] = ['hardware', 'software', 'network', 'access', 'email', 'printer', 'account', 'other'];

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ status: '', priority: '', category: '', page: 1, per_page: 10 });
        setSearchQuery('');
    };

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
                    <p className="text-gray-500 mt-1">Manage and track all support tickets</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <span>+</span>
                    <span>Create Ticket</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by ticket number or title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                                className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Statuses</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {formatStatusName(status)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Priorities</option>
                            {priorities.map((priority) => (
                                <option key={priority} value={priority}>
                                    {formatPriorityName(priority)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {getCategoryIcon(category)} {formatCategoryName(category)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                        <p className="text-gray-500">Loading tickets...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-gray-900 font-medium mb-2">Error loading tickets</p>
                        <p className="text-gray-500 text-sm">Please try again later or contact support</p>
                    </div>
                ) : data?.data && data.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Ticket
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            AI Confidence
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-gray-900">{ticket.ticket_number}</div>
                                                        <div className="text-sm text-gray-600 truncate max-w-md mt-0.5">{ticket.title}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xl">{getCategoryIcon(ticket.category)}</span>
                                                    <span className="text-sm text-gray-700">{formatCategoryName(ticket.category)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {formatStatusName(ticket.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                    {formatPriorityName(ticket.priority)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ticket.ai_confidence ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                                                                style={{ width: `${ticket.ai_confidence * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-gray-600">{Math.round(ticket.ai_confidence * 100)}%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDateTime(ticket.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/dashboard/tickets/${ticket.id}`}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    View Details →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {data.total_pages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {(data.page - 1) * data.per_page + 1} to {Math.min(data.page * data.per_page, data.total)} of {data.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={data.page === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {data.page} of {data.total_pages}
                                    </span>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={data.page === data.total_pages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <span className="text-3xl">🎫</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-500 mb-6">
                            {filters.status || filters.priority || filters.category || searchQuery
                                ? 'Try adjusting your filters or search query'
                                : 'Create your first ticket to get started'}
                        </p>
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            Create New Ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
