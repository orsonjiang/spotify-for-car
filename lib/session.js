import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'token';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

const LOOPBACK_HTTP = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

function getKey() {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET is not set');
	return new TextEncoder().encode(secret);
}

export async function signSession(userId) {
	return new SignJWT({ userId: String(userId) })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(`${SESSION_MAX_AGE}s`)
		.sign(getKey());
}

// → userId string, or null for a missing/invalid/expired token.
export async function verifySession(token) {
	if (typeof token !== 'string' || !token) return null;
	try {
		const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] });
		return typeof payload.userId === 'string' && payload.userId ? payload.userId : null;
	} catch {
		return null;
	}
}

// Reads the `token` cookie of the current request. Request-time API: callers must sit behind <Suspense>
// (or `instant = false`) when Cache Components prerenders.
export async function getSessionUserId() {
	const cookieStore = await cookies();
	return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

// Cookies are `secure` in production, except when the app itself is served from plain-http loopback
// (`next start` on localhost, e.g. for Cypress), where browsers may drop secure cookies.
export function secureCookies(appOrigin) {
	return process.env.NODE_ENV === 'production' && !LOOPBACK_HTTP.test(appOrigin ?? '');
}

export function sessionCookieOptions(appOrigin) {
	return {
		httpOnly: true,
		sameSite: 'lax', // strict would drop the cookie on the redirect back from accounts.spotify.com
		secure: secureCookies(appOrigin),
		path: '/',
		maxAge: SESSION_MAX_AGE,
	};
}
