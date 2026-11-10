import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { OAUTH_STATE_COOKIE, getAppOrigin, getRedirectUri, stateCookieOptions, upsertSpotifyUser } from '@/lib/auth';
import { SESSION_COOKIE, sessionCookieOptions, signSession } from '@/lib/session';
import { exchangeCodeForTokens, getProfile } from '@/lib/spotify';
import { safeRedirectPath } from '@/lib/validate';

function readStateCookie(value) {
	if (!value) return null;
	try {
		const parsed = JSON.parse(value);
		return parsed && typeof parsed.state === 'string' ? parsed : null;
	} catch {
		return null;
	}
}

function sameString(a, b) {
	const bufA = Buffer.from(String(a));
	const bufB = Buffer.from(String(b));
	return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

// GET /api/auth/callback?code&state (Spotify redirects here after the user approves, or with ?error=…).
export async function GET(request) {
	const { searchParams } = request.nextUrl;
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const saved = readStateCookie(request.cookies.get(OAUTH_STATE_COOKIE)?.value);
	const appOrigin = getAppOrigin(request);

	// Always clears the one-time state cookie; sets the session cookie on success.
	const finish = (path, sessionToken) => {
		const response = NextResponse.redirect(new URL(path, appOrigin));
		response.cookies.set(OAUTH_STATE_COOKIE, '', { ...stateCookieOptions(appOrigin), maxAge: 0 });
		if (sessionToken) response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions(appOrigin));
		return response;
	};

	if (!code || !state || !saved || !sameString(state, saved.state)) return finish('/error');

	try {
		const tokens = await exchangeCodeForTokens(code, getRedirectUri(request));
		if (!tokens) return finish('/error');

		const profile = await getProfile(tokens.accessToken);
		if (!profile) return finish('/error');

		const user = await upsertSpotifyUser(tokens, profile);
		if (!user) return finish('/error');

		const sessionToken = await signSession(user._id.toString());
		const location = safeRedirectPath(saved.location);
		return finish(location === '/' ? `/${encodeURIComponent(user.url)}` : location, sessionToken);
	} catch (err) {
		console.error(`OAuth callback failed: ${err?.message ?? err}`);
		return finish('/error');
	}
}
