'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTicket, fetchTicketActivities, updateTicketStatus, updateTicket, addTicketComment, assignTicket, fetchUsers } from '@/lib/api';
import {
    formatDateTime,
    timeAgo,
    getStatusColor,
    getPriorityColor,
    getCategoryIcon,
    formatStatusName,
    formatPriorityName,
    formatCategoryName
} from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { TicketStatus, TicketPriority } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { can } = useAuth();
    const { id } = use(params);
    const ticketId = parseInt(id);
    const [comment, setComment] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<TicketPriority | ''>('');
    const [selectedAssignee, setSelectedAssignee] = useState<number | ''>('');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const queryClient = useQueryClient();

    const { data: ticket, isLoading, error } = useQuery({
        queryKey: ['ticket', ticketId],
        queryFn: () => fetchTicket(ticketId),
    });

    const { data: activities } = useQuery({
        queryKey: ['ticket-activities', ticketId],
        queryFn: () => fetchTicketActivities(ticketId),
        enabled: !!ticket,
    });

    const { data: usersData } = useQuery({
        queryKey: ['users'],
        queryFn: () => fetchUsers({ role: 'it_support' }),
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: string) => {
            if (!can('ticket:update_status')) {
                throw new Error('You do not have permission to update ticket status.');
            }
            return updateTicketStatus(ticketId, status);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
            queryClient.invalidateQueries({ queryKey: ['ticket-activities', ticketId] });
            setShowStatusDropdown(false);
        },
    });

    const updatePriorityMutation = useMutation({
        mutationFn: (priority: TicketPriority) => {
            if (!can('ticket:update_priority')) {
                throw new Error('You do not have permission to update ticket priority.');
            }
            return updateTicket(ticketId, { priority });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
            queryClient.invalidateQueries({ queryKey: ['ticket-activities', ticketId] });
            setSelectedPriority('');
        },
    });

    const assignTicketMutation = useMutation({
        mutationFn: (assignedToId: number) => {
            if (!can('ticket:assign')) {
                throw new Error('You do not have permission to assign tickets.');
            }
            return assignTicket(ticketId, assignedToId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
            queryClient.invalidateQueries({ queryKey: ['ticket-activities', ticketId] });
            setSelectedAssignee('');
        },
    });

    const addCommentMutation = useMutation({
        mutationFn: (commentText: string) => {
            if (!can('ticket:comment')) {
                throw new Error('You do not have permission to comment on tickets.');
            }
            return addTicketComment(ticketId, commentText);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket-activities', ticketId] });
            setComment('');
        },
    });

    const handlePriorityUpdate = () => {
        if (selectedPriority) {
            updatePriorityMutation.mutate(selectedPriority);
        }
    };

    const handleAssignment = () => {
        if (selectedAssignee) {
            assignTicketMutation.mutate(Number(selectedAssignee));
        }
    };

    const handleAddComment = () => {
        if (comment.trim()) {
            addCommentMutation.mutate(comment);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
                <p className="text-gray-500 mb-6">The ticket you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/dashboard/tickets" className="text-blue-600 hover:text-blue-700">
                    ← Back to Tickets
                </Link>
            </div>
        );
    }

    const statuses: TicketStatus[] = ['open', 'in_progress', 'waiting_on_user', 'resolved', 'closed', 'cancelled'];
    const priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/dashboard/tickets"
                        className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
                    >
                        ← Back to Tickets
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{ticket.ticket_number}</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${getStatusColor(ticket.status)}`}>
                        {formatStatusName(ticket.status)}
                    </span>
                    <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${getPriorityColor(ticket.priority)}`}>
                        {formatPriorityName(ticket.priority)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">{ticket.title}</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-500">Category</span>
                                <div className="mt-1 flex items-center space-x-2">
                                    <span className="text-xl">{getCategoryIcon(ticket.category)}</span>
                                    <span className="text-sm font-medium text-gray-900">{formatCategoryName(ticket.category)}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Created</span>
                                <div className="mt-1 text-sm font-medium text-gray-900">{formatDateTime(ticket.created_at)}</div>
                            </div>
                        </div>
                    </div>

                    {/* AI Classification */}
                    {ticket.ai_classification && (
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-xl">🤖</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Classification Analysis</h3>

                                    <div className="bg-white rounded-lg p-4 mb-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Category</span>
                                                <div className="mt-1 flex items-center space-x-2">
                                                    <span>{getCategoryIcon(ticket.category)}</span>
                                                    <span className="text-sm font-semibold text-gray-900">{formatCategoryName(ticket.category)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Priority</span>
                                                <div className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(ticket.priority)}`}>
                                                        {formatPriorityName(ticket.priority)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {ticket.ai_confidence && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600">Confidence Score</span>
                                                <span className="text-sm font-semibold text-gray-900">{Math.round(ticket.ai_confidence * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-linear-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                                                    style={{ width: `${ticket.ai_confidence * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-700 bg-white rounded-lg p-4">
                                        <p className="font-medium mb-2">Classification Details:</p>
                                        <p className="whitespace-pre-wrap">{ticket.ai_classification}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comments & Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>

                        {!can('ticket:comment') ? (
                            <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                                Your role is read-only for comments on this ticket.
                            </div>
                        ) : null}

                        <div className="space-y-4 mb-6">
                            {activities && activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div key={activity.id} className="flex space-x-3">
                                        <div className="shrink-0">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-semibold text-gray-600">
                                                    {activity.user?.full_name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <span className="font-medium text-gray-900">{activity.user?.full_name || 'User'}</span>
                                                    <span className="text-gray-500 text-sm ml-2">{activity.activity_type}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{timeAgo(activity.created_at)}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{activity.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="border-t border-gray-200 pt-4">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={handleAddComment}
                                    disabled={!can('ticket:comment') || !comment.trim() || addCommentMutation.isPending}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                disabled={!can('ticket:update_status')}
                                title={can('ticket:update_status') ? 'Update status' : 'Not allowed for your role'}
                                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>📝</span>
                                <span>Update Status</span>
                            </button>
                        </div>
                    </div>

                    {/* Update Status */}
                    {showStatusDropdown && can('ticket:update_status') && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Status</h3>
                            <div className="space-y-2 mb-4">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            updateStatusMutation.mutate(status);
                                        }}
                                        disabled={ticket.status === status || updateStatusMutation.isPending}
                                        className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${ticket.status === status
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${getStatusColor(status)}`}>
                                            {formatStatusName(status)}
                                        </span>
                                        {ticket.status === status && '(Current)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Update Priority */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Update Priority</h3>
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value as TicketPriority)}
                            disabled={!can('ticket:update_priority')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        >
                            <option value="">Current: {formatPriorityName(ticket.priority)}</option>
                            {priorities.map((priority) => (
                                <option key={priority} value={priority} disabled={priority === ticket.priority}>
                                    {formatPriorityName(priority)} {priority === ticket.priority ? '(Current)' : ''}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handlePriorityUpdate}
                            disabled={!can('ticket:update_priority') || !selectedPriority || updatePriorityMutation.isPending}
                            className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updatePriorityMutation.isPending ? 'Updating...' : 'Update Priority'}
                        </button>
                    </div>

                    {/* Assign Ticket */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Assign Ticket</h3>
                        <select
                            value={selectedAssignee}
                            onChange={(e) => setSelectedAssignee(e.target.value ? Number(e.target.value) : '')}
                            disabled={!can('ticket:assign')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        >
                            <option value="">Select IT Staff...</option>
                            {usersData?.users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.full_name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssignment}
                            disabled={!can('ticket:assign') || !selectedAssignee || assignTicketMutation.isPending}
                            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {assignTicketMutation.isPending ? 'Assigning...' : 'Assign Ticket'}
                        </button>
                    </div>

                    {/* Ticket Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Ticket Information</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Ticket ID</span>
                                <p className="text-sm font-medium text-gray-900 mt-1">{ticket.ticket_number}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Created By</span>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {ticket.user?.full_name || 'Unknown'}
                                    <br />
                                    <span className="text-xs text-gray-500">{ticket.user?.email}</span>
                                </p>
                            </div>
                            {ticket.assigned_to && (
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</span>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {ticket.assigned_to.full_name}
                                        <br />
                                        <span className="text-xs text-gray-500">{ticket.assigned_to.email}</span>
                                    </p>
                                </div>
                            )}
                            {ticket.sla_deadline && (
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">SLA Deadline</span>
                                    <p className="text-sm font-medium text-red-600 mt-1">{formatDateTime(ticket.sla_deadline)}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</span>
                                <p className="text-sm font-medium text-gray-900 mt-1">{timeAgo(ticket.updated_at)}</p>
                            </div>
                            {ticket.resolved_at && (
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Resolved At</span>
                                    <p className="text-sm font-medium text-green-600 mt-1">{formatDateTime(ticket.resolved_at)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
