import { NextRequest, NextResponse } from 'next/server';
import { decodeCookieSession, SessionKeys } from '@/lib/session';

function isSessionValid(request: NextRequest): boolean {
    const cookie = request.cookies.get(SessionKeys.cookie)?.value;
    if (!cookie) {
        return false;
    }

    const decoded = decodeCookieSession(cookie);
    if (!decoded?.token || !decoded?.expiresAt) {
        return false;
    }

    return decoded.expiresAt > Date.now();
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authenticated = isSessionValid(request);

    if (pathname.startsWith('/dashboard') && !authenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/login') && authenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
