import { NextResponse } from 'next/server';
import { getAppOrigin } from '@/lib/auth';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { safeRedirectPath } from '@/lib/validate';

// GET /api/auth/logout?location=/path → clears the session cookie and goes back to `location` (or `/`).
export async function GET(request) {
	const location = safeRedirectPath(request.nextUrl.searchParams.get('location'));
	const appOrigin = getAppOrigin(request);

	const response = NextResponse.redirect(new URL(location, appOrigin));
	response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions(appOrigin), maxAge: 0 });
	return response;
}
