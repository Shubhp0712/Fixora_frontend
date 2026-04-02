import { AppRole } from './rbac';

const SESSION_STORAGE_KEY = 'fixora.session';
const SESSION_COOKIE_KEY = 'fixora_session';
const DEFAULT_TIMEOUT_MINUTES = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES || 30);

export type SessionUser = {
    id: number;
    fullName: string;
    email: string;
    role: AppRole;
    organizationId: string;
    organizationName: string;
};

export type SessionData = {
    token: string;
    user: SessionUser;
    expiresAt: number;
};

function getCookieDomainPath(): string {
    return 'path=/; SameSite=Lax';
}

function toBase64(value: string): string {
    if (typeof globalThis.btoa === 'function') {
        return globalThis.btoa(value);
    }
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(value).toString('base64');
    }
    throw new Error('No base64 encoder available in this runtime');
}

function fromBase64(value: string): string {
    if (typeof globalThis.atob === 'function') {
        return globalThis.atob(value);
    }
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(value, 'base64').toString('utf-8');
    }
    throw new Error('No base64 decoder available in this runtime');
}

function setSessionCookie(session: SessionData): void {
    if (typeof document === 'undefined') return;
    const payload = toBase64(JSON.stringify({
        token: session.token,
        role: session.user.role,
        organizationId: session.user.organizationId,
        expiresAt: session.expiresAt,
    }));
    document.cookie = `${SESSION_COOKIE_KEY}=${payload}; ${getCookieDomainPath()}`;
}

function clearSessionCookie(): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${SESSION_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function buildSession(user: SessionUser): SessionData {
    const expiresAt = Date.now() + DEFAULT_TIMEOUT_MINUTES * 60 * 1000;
    return {
        token: `fxr_${Math.random().toString(36).slice(2)}_${Date.now()}`,
        user,
        expiresAt,
    };
}

export function saveSession(session: SessionData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    setSessionCookie(session);
}

export function getSession(): SessionData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as SessionData;
        if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) {
            clearSession();
            return null;
        }
        return parsed;
    } catch {
        clearSession();
        return null;
    }
}

export function clearSession(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    clearSessionCookie();
}

export function refreshSessionTimeout(): SessionData | null {
    const session = getSession();
    if (!session) return null;

    const updated: SessionData = {
        ...session,
        expiresAt: Date.now() + DEFAULT_TIMEOUT_MINUTES * 60 * 1000,
    };
    saveSession(updated);
    return updated;
}

export function decodeCookieSession(cookieValue: string): {
    token?: string;
    role?: AppRole;
    organizationId?: string;
    expiresAt?: number;
} | null {
    try {
        return JSON.parse(fromBase64(cookieValue));
    } catch {
        return null;
    }
}

export const SessionKeys = {
    storage: SESSION_STORAGE_KEY,
    cookie: SESSION_COOKIE_KEY,
};
