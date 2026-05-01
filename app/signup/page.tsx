'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [department, setDepartment] = useState('IT');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');
        setIsError(false);

        if (password !== confirmPassword) {
            setIsError(true);
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setIsError(true);
            setMessage('Password must be at least 8 characters long.');
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/auth/bootstrap-admin`, {
                email,
                full_name: fullName,
                password,
                department,
                phone: phone || null,
            });

            setMessage('Admin account created successfully. Please sign in.');
            setTimeout(() => router.push('/login'), 1200);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    setIsError(true);
                    setMessage('Signup is disabled because users already exist. Ask an admin to create your account.');
                } else {
                    setIsError(true);
                    setMessage(error.response?.data?.detail || 'Unable to create account right now.');
                }
            } else {
                setIsError(true);
                setMessage('Unable to create account right now.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-10">
            <div className="mx-auto max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg p-8 shadow-2xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-white">Fixora Setup</h1>
                    <p className="mt-2 text-sm text-slate-200">Create first admin account (one-time bootstrap)</p>
                </div>

                {message ? (
                    <div className={`mb-4 rounded-lg px-3 py-2 text-sm ${isError ? 'border border-red-300/40 bg-red-100/20 text-red-100' : 'border border-emerald-300/40 bg-emerald-100/20 text-emerald-100'}`}>
                        {message}
                    </div>
                ) : null}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-slate-200">Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-blue-300"
                            placeholder="Admin User"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-200">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-blue-300"
                            placeholder="admin@fixora.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-200">Department</label>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-blue-300"
                            placeholder="IT"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-200">Phone (Optional)</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-blue-300"
                            placeholder="+1234567890"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-200">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-blue-300"
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-200">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-blue-300"
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Admin Account'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <Link href="/login" className="text-blue-200 hover:text-blue-100">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
