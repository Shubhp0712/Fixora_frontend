'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchTickets } from '@/lib/api';
import { formatDateTime, getStatusColor, getPriorityColor } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchDashboardStats,
    });

    const { data: recentTickets, isLoading: ticketsLoading } = useQuery({
        queryKey: ['recent-tickets'],
        queryFn: () => fetchTickets({ page: 1, page_size: 5 }),
    });

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Tickets */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {statsLoading ? '...' : stats?.total_tickets || 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎫</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600 font-medium">↗ 12%</span>
                        <span className="text-gray-500 ml-2">vs last month</span>
                    </div>
                </div>

                {/* Open Tickets */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {statsLoading ? '...' : stats?.open_tickets || 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🔓</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-orange-600 font-medium">Needs attention</span>
                    </div>
                </div>

                {/* Resolved Today */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {statsLoading ? '...' : stats?.resolved_today || 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600 font-medium">↗ 8%</span>
                        <span className="text-gray-500 ml-2">vs yesterday</span>
                    </div>
                </div>

                {/* Avg Resolution Time */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {statsLoading ? '...' : `${stats?.average_resolution_hours || 0}h`}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">⏱️</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600 font-medium">↙ 15%</span>
                        <span className="text-gray-500 ml-2">faster</span>
                    </div>
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
                    <Link
                        href="/dashboard/tickets"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        View all →
                    </Link>
                </div>

                {ticketsLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                ) : recentTickets?.tickets && recentTickets.tickets.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ticket
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentTickets.tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{ticket.ticket_number}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-md">{ticket.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDateTime(ticket.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/tickets/${ticket.id}`}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No tickets found</p>
                        <Link
                            href="/dashboard/tickets"
                            className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700"
                        >
                            Create your first ticket
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/tickets?status=open"
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎫</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Create Ticket</h3>
                            <p className="text-sm text-gray-500">Report a new issue</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/kb"
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
                            <p className="text-sm text-gray-500">Find solutions</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/analytics"
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">View Analytics</h3>
                            <p className="text-sm text-gray-500">Performance insights</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
