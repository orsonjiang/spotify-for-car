import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { OAUTH_STATE_COOKIE, getAppOrigin, getRedirectUri, stateCookieOptions } from '@/lib/auth';
import { SPOTIFY_SCOPES } from '@/lib/spotify';
import { safeRedirectPath } from '@/lib/validate';

// GET /api/auth/login?location=/some/path → Spotify authorize page.
export async function GET(request) {
	const location = safeRedirectPath(request.nextUrl.searchParams.get('location'));
	const appOrigin = getAppOrigin(request);

	const clientId = process.env.CLIENT_ID;
	if (!clientId) {
		console.error('CLIENT_ID is not set');
		return NextResponse.redirect(new URL('/error', appOrigin));
	}

	const state = randomBytes(16).toString('hex');
	const authorizeUrl = new URL('https://accounts.spotify.com/authorize');
	authorizeUrl.search = new URLSearchParams({
		response_type: 'code',
		client_id: clientId,
		scope: SPOTIFY_SCOPES,
		redirect_uri: getRedirectUri(request),
		state,
	}).toString();

	const response = NextResponse.redirect(authorizeUrl);
	response.cookies.set(OAUTH_STATE_COOKIE, JSON.stringify({ state, location }), stateCookieOptions(appOrigin));
	return response;
}
