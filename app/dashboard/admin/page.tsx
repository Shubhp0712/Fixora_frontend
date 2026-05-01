'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/components/AuthProvider';
import { createUser, fetchUsers } from '@/lib/api';
import { UserRole } from '@/lib/types';

export default function AdminPage() {
    const { can, session } = useAuth();
    const canAccessAdmin = can('admin:access');
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        email: '',
        full_name: '',
        password: '',
        role: 'employee' as UserRole,
        department: '',
        phone: '',
    });
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { data: usersData, isLoading } = useQuery({
        queryKey: ['admin-users-list'],
        queryFn: () => fetchUsers({ page: 1, page_size: 200 }),
        enabled: canAccessAdmin,
    });

    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            setMessage('User created successfully.');
            setErrorMessage('');
            setForm({
                email: '',
                full_name: '',
                password: '',
                role: 'employee',
                department: '',
                phone: '',
            });
            queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
        },
        onError: (error: unknown) => {
            setMessage('');
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.detail || 'Unable to create user right now.');
                return;
            }
            setErrorMessage('Unable to create user right now.');
        },
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canAccessAdmin) {
            return;
        }
        setMessage('');
        setErrorMessage('');
        createUserMutation.mutate({
            email: form.email,
            full_name: form.full_name,
            password: form.password,
            role: form.role,
            department: form.department || undefined,
            phone: form.phone || undefined,
        });
    };

    if (!canAccessAdmin) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                <h1 className="text-xl font-semibold text-amber-900">Restricted Area</h1>
                <p className="mt-2 text-sm text-amber-800">
                    Your role does not have access to admin features for this organization.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Controls</h1>
                <p className="text-gray-600 mt-1">
                    Role: {session?.user.role}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Create User</h2>

                    {message ? <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div> : null}
                    {errorMessage ? <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div> : null}

                    <form onSubmit={onSubmit} className="space-y-3">
                        <input
                            required
                            type="text"
                            placeholder="Full name"
                            value={form.full_name}
                            onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <input
                            required
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <input
                            required
                            type="password"
                            placeholder="Password (min 8 chars)"
                            value={form.password}
                            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={form.role}
                                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                <option value="employee">Employee</option>
                                <option value="it_support">IT Support</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Department"
                                value={form.department}
                                onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Phone (optional)"
                            value={form.phone}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />

                        <button
                            type="submit"
                            disabled={createUserMutation.isPending}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                        </button>
                    </form>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Users</h2>

                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading users...</p>
                    ) : usersData?.users?.length ? (
                        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                            {usersData.users.map((user) => (
                                <div key={user.id} className="py-3">
                                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                                    <p className="text-xs text-gray-600">{user.email}</p>
                                    <p className="text-xs text-indigo-700">{user.role}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
