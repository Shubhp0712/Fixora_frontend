'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated, isBootstrapping } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMessage, setAuthMessage] = useState(() => {
        if (typeof window === 'undefined') return '';
        const message = sessionStorage.getItem('fixora.auth.message') || '';
        if (message) {
            sessionStorage.removeItem('fixora.auth.message');
        }
        return message;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isBootstrapping && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isBootstrapping, router]);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        const result = await login({
            email,
            password,
            redirectTo: searchParams.get('redirect') || '/dashboard',
        });

        if (!result.ok) {
            setAuthMessage(result.message);
        }
        setIsSubmitting(false);
    };

    if (isBootstrapping) {
        return <div className="min-h-screen grid place-items-center text-slate-200 bg-slate-950">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-10">
            <div className="mx-auto max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg p-8 shadow-2xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-white">Fixora Login</h1>
                    <p className="mt-2 text-sm text-slate-200">Secure access for organization-specific IT operations</p>
                </div>

                {authMessage ? (
                    <div className="mb-4 rounded-lg border border-amber-300/40 bg-amber-100/20 px-3 py-2 text-sm text-amber-100">
                        {authMessage}
                    </div>
                ) : null}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-slate-200">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white outline-none focus:border-blue-300"
                            placeholder="jane@company.com"
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
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-5 text-center text-xs text-slate-300">
                    Session timeout is active. Inactivity auto-logs out for security.
                </p>

                <div className="mt-4 text-center text-sm">
                    <Link href="/" className="text-blue-200 hover:text-blue-100">
                        Back to home
                    </Link>
                </div>

                <div className="mt-2 text-center text-xs text-slate-300">
                    First-time setup?{' '}
                    <Link href="/signup" className="text-blue-200 hover:text-blue-100">
                        Create first admin
                    </Link>
                </div>
            </div>
        </div>
    );
}
