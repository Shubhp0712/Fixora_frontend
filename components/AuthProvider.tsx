'use client';

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';
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
    fullName: string;
    role: AppRole;
    organizationId: string;
    organizationName: string;
};

type AuthContextValue = {
    session: SessionData | null;
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    login: (input: LoginInput) => void;
    logout: (reason?: string) => void;
    can: (permission: Permission) => boolean;
    roleLabel: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_CHECK_INTERVAL_MS = 15 * 1000;

export default function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [session, setSession] = useState<SessionData | null>(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        const existing = getSession();
        setSession(existing);
        setIsBootstrapping(false);
    }, []);

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
    }, []);

    const doLogout = (reason?: string) => {
        clearSession();
        setSession(null);
        if (reason) {
            sessionStorage.setItem('fixora.auth.message', reason);
        }
        router.push('/login');
    };

    const login = (input: LoginInput) => {
        const user: SessionUser = {
            id: Date.now(),
            email: input.email,
            fullName: input.fullName,
            role: input.role,
            organizationId: input.organizationId,
            organizationName: input.organizationName,
        };
        const newSession = buildSession(user);
        saveSession(newSession);
        setSession(newSession);
        router.push('/dashboard');
    };

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
    }, [session, isBootstrapping]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
