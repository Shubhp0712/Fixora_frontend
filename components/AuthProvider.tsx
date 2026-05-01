'use client';

import {
    useCallback,
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AppRole, Permission, getRoleLabel, hasPermission } from '@/lib/rbac';
import {
    buildSession,
    clearSession,
    getSession,
    refreshSessionTimeout,
    saveSession,
    SessionData,
    SessionUser,
} from '@/lib/session';

type LoginInput = {
    email: string;
    password: string;
    redirectTo?: string;
};

type AuthContextValue = {
    session: SessionData | null;
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    login: (input: LoginInput) => Promise<{ ok: true } | { ok: false; message: string }>;
    logout: (reason?: string) => void;
    can: (permission: Permission) => boolean;
    roleLabel: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_CHECK_INTERVAL_MS = 15 * 1000;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [session, setSession] = useState<SessionData | null>(() => getSession());
    const [isBootstrapping] = useState(false);

    const doLogout = useCallback((reason?: string) => {
        clearSession();
        setSession(null);
        if (reason) {
            sessionStorage.setItem('fixora.auth.message', reason);
        }
        router.push('/login');
    }, [router]);

    useEffect(() => {
        const interval = window.setInterval(() => {
            const current = getSession();
            if (!current) {
                setSession(null);
            }
        }, SESSION_CHECK_INTERVAL_MS);

        const onAuthError = () => {
            doLogout('Session is no longer valid. Please log in again.');
        };

        window.addEventListener('fixora:auth-error', onAuthError as EventListener);

        return () => {
            window.clearInterval(interval);
            window.removeEventListener('fixora:auth-error', onAuthError as EventListener);
        };
    }, [doLogout]);

    const login = useCallback(async (input: LoginInput): Promise<{ ok: true } | { ok: false; message: string }> => {
        try {
            const form = new URLSearchParams();
            form.append('username', input.email);
            form.append('password', input.password);

            const tokenResponse = await axios.post(
                `${API_URL}/auth/login`,
                form,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const accessToken: string | undefined = tokenResponse.data?.access_token;
            const refreshToken: string | undefined = tokenResponse.data?.refresh_token;

            if (!accessToken || !refreshToken) {
                return { ok: false, message: 'Invalid authentication response from server.' };
            }

            const meResponse = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const me = meResponse.data;
            const user: SessionUser = {
                id: me.id,
                email: me.email,
                fullName: me.full_name,
                role: me.role as AppRole,
            };

            const newSession = buildSession(user, accessToken, refreshToken);
            saveSession(newSession);
            setSession(newSession);
            router.push(input.redirectTo || '/dashboard');
            return { ok: true };
        } catch (error: unknown) {
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            if (status === 401) {
                return { ok: false, message: 'Invalid email or password.' };
            }
            return { ok: false, message: 'Unable to sign in right now. Please try again.' };
        }
    }, [router]);

    useEffect(() => {
        const onUserActivity = () => {
            if (!session) return;
            const updated = refreshSessionTimeout();
            if (updated) {
                setSession(updated);
            }
        };

        const events: Array<keyof WindowEventMap> = ['click', 'keydown', 'mousemove'];
        events.forEach((eventName) => {
            window.addEventListener(eventName, onUserActivity);
        });

        return () => {
            events.forEach((eventName) => {
                window.removeEventListener(eventName, onUserActivity);
            });
        };
    }, [session]);

    const value = useMemo<AuthContextValue>(() => {
        const role = session?.user.role;
        return {
            session,
            isAuthenticated: Boolean(session),
            isBootstrapping,
            login,
            logout: doLogout,
            can: (permission: Permission) => {
                if (!role) return false;
                return hasPermission(role, permission);
            },
            roleLabel: role ? getRoleLabel(role) : '',
        };
    }, [session, isBootstrapping, login, doLogout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
