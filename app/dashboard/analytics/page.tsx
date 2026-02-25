'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchTickets, fetchDashboardStats } from '@/lib/api';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCategoryName, formatStatusName, formatPriorityName } from '@/lib/utils';

const COLORS = {
    category: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#64748B'],
    status: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#64748B', '#EF4444'],
    priority: ['#64748B', '#3B82F6', '#F59E0B', '#EF4444'],
};

export default function AnalyticsPage() {
    const { data: stats } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchDashboardStats,
    });

    const { data: allTickets } = useQuery({
        queryKey: ['all-tickets'],
        queryFn: () => fetchTickets({ per_page: 1000 }),
    });

    // Process data for charts
    const getCategoryData = () => {
        if (!allTickets?.data) return [];
        const categoryCount: Record<string, number> = {};
        allTickets.data.forEach((ticket) => {
            categoryCount[ticket.category] = (categoryCount[ticket.category] || 0) + 1;
        });
        return Object.entries(categoryCount).map(([name, value]) => ({
            name: formatCategoryName(name as any),
            value,
        }));
    };

    const getStatusData = () => {
        if (!allTickets?.data) return [];
        const statusCount: Record<string, number> = {};
        allTickets.data.forEach((ticket) => {
            statusCount[ticket.status] = (statusCount[ticket.status] || 0) + 1;
        });
        return Object.entries(statusCount).map(([name, value]) => ({
            name: formatStatusName(name as any),
            value,
        }));
    };

    const getPriorityData = () => {
        if (!allTickets?.data) return [];
        const priorityCount: Record<string, number> = {};
        allTickets.data.forEach((ticket) => {
            priorityCount[ticket.priority] = (priorityCount[ticket.priority] || 0) + 1;
        });
        return Object.entries(priorityCount).map(([name, value]) => ({
            name: formatPriorityName(name as any),
            Tickets: value,
        }));
    };

    const getTrendData = () => {
        if (!allTickets?.data) return [];

        // Group tickets by date (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const trendData = last7Days.map((date) => {
            const dayTickets = allTickets.data.filter((ticket) => {
                return ticket.created_at.startsWith(date);
            });

            return {
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                created: dayTickets.length,
                resolved: dayTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
            };
        });

        return trendData;
    };

    const categoryData = getCategoryData();
    const statusData = getStatusData();
    const priorityData = getPriorityData();
    const trendData = getTrendData();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-500 mt-1">Comprehensive insights into ticket performance and trends</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-100 text-sm font-medium">Total Tickets</span>
                        <span className="text-3xl">🎫</span>
                    </div>
                    <p className="text-4xl font-bold">{stats?.total_tickets || 0}</p>
                    <p className="text-blue-100 text-sm mt-2">All time</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-green-100 text-sm font-medium">Resolution Rate</span>
                        <span className="text-3xl">✅</span>
                    </div>
                    <p className="text-4xl font-bold">
                        {allTickets?.data
                            ? Math.round((allTickets.data.filter(t => t.status === 'resolved' || t.status === 'closed').length / allTickets.data.length) * 100)
                            : 0}%
                    </p>
                    <p className="text-green-100 text-sm mt-2">Success rate</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-100 text-sm font-medium">Avg Resolution</span>
                        <span className="text-3xl">⏱️</span>
                    </div>
                    <p className="text-4xl font-bold">{stats?.average_resolution_time || 0}h</p>
                    <p className="text-purple-100 text-sm mt-2">Time to resolve</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-orange-100 text-sm font-medium">Open Tickets</span>
                        <span className="text-3xl">🔓</span>
                    </div>
                    <p className="text-4xl font-bold">{stats?.open_tickets || 0}</p>
                    <p className="text-orange-100 text-sm mt-2">Pending action</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tickets by Category - Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Tickets by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS.category[index % COLORS.category.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Tickets by Status - Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Tickets by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Ticket Trends - Line Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Ticket Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="created" stroke="#3B82F6" strokeWidth={2} name="Created" />
                            <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Priority Distribution - Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Priority Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={priorityData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="Tickets" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Classification Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🤖</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Classification Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Average Confidence</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {allTickets?.data
                                        ? Math.round(
                                            (allTickets.data.reduce((sum, t) => sum + (t.ai_confidence || 0), 0) / allTickets.data.length) * 100
                                        )
                                        : 0}%
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">AI Classified</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {allTickets?.data ? allTickets.data.filter(t => t.ai_classification).length : 0}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Automation Rate</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {allTickets?.data
                                        ? Math.round((allTickets.data.filter(t => t.ai_classification).length / allTickets.data.length) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
