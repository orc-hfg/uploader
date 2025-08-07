/*
 * Authentication Mock Plugin for Local Development
 *
 * Provides functional authentication endpoints for local development and testing.
 *
 * IMPORTANT: URL Structure Difference
 * - Production: Authentication runs at root path (https://server/auth/*)
 * - Local Development: Authentication runs under app path (http://localhost:3000/uploader/auth/*)
 *
 * This difference exists because Nuxt Server Routes are bound to app.baseURL and cannot
 * be defined outside this scope. Attempts to serve routes at root level while keeping
 * the app under /uploader/ break the application.
 *
 * This is an acceptable limitation - the mock provides functional authentication testing
 * even though the URL structure differs from production.
 *
 * Authentication Flow:
 * 1. Client requests session initialization (GET /auth/auth-systems)
 * 2. Plugin sets CSRF token cookie for security
 * 3. Client submits login credentials with CSRF token (POST /auth/auth-systems/password/password/sign-in)
 * 4. Plugin validates credentials and CSRF token
 * 5. On success, sets session cookie for subsequent requests
 */

import { randomBytes } from 'node:crypto';
import { AUTHENTICATION_MOCK_SESSION_PREFIX, AUTHENTICATION_MOCK_VALID_USER, AUTHENTICATION_MOCK_VALID_USER_PASSWORD } from '@@/shared/constants/test';
import { StatusCodes } from 'http-status-codes';

const config = useRuntimeConfig();
const publicConfig = config.public;
const authenticationConfig = publicConfig.authentication;

const isAuthenticationMockEnabled = publicConfig.enableAuthenticationMock;

interface SignInRequestBody {
	login: string;
	password: string;
}

function generateCsrfToken(): string {
	const CSRF_TOKEN_BYTES = 12;

	return `mock-csrf-${randomBytes(CSRF_TOKEN_BYTES).toString('base64url')}`;
}

export default defineNitroPlugin((nitroApp) => {
	if (!isAuthenticationMockEnabled) {
		return;
	}

	const { emailOrLoginParameter, csrfCookieName, csrfHeaderName, sessionCookieName } = authenticationConfig;

	// Build authentication route paths
	const getSystemPath = `/${authenticationConfig.basePath}${authenticationConfig.signInPathName}/${authenticationConfig.systemPathName}`;
	const postSignInPath = `/${authenticationConfig.basePath}${authenticationConfig.signInPathName}/${authenticationConfig.systemPathName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.signInPathName}`;
	const getSignOutPath = `/${authenticationConfig.basePath}${authenticationConfig.signOutPathName}`;

	nitroApp.router.get(getSystemPath, defineEventHandler((event) => {
		setCookie(event, csrfCookieName, generateCsrfToken(), {
			path: '/',
			httpOnly: false,
		});
	}));

	nitroApp.router.post(postSignInPath, defineEventHandler(async (event) => {
		const body = await readBody<SignInRequestBody>(event);
		const query = getQuery(event);
		const loginValue = query[emailOrLoginParameter] ?? '';

		const csrfToken = (getCookie(event, csrfCookieName) ?? '').toLowerCase();
		const csrfHeader = (getHeader(event, csrfHeaderName) ?? '').toLowerCase();

		if (csrfToken !== csrfHeader) {
			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'The CSRF token does not match.',
			});
		}

		if (loginValue !== AUTHENTICATION_MOCK_VALID_USER.login || body.password !== AUTHENTICATION_MOCK_VALID_USER_PASSWORD) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: 'The provided credentials are invalid.',
			});
		}

		setCookie(event, sessionCookieName, `${AUTHENTICATION_MOCK_SESSION_PREFIX}${AUTHENTICATION_MOCK_VALID_USER.id}`, {
			path: '/',
			httpOnly: true,
		});
	}));

	nitroApp.router.get(getSignOutPath, defineEventHandler((event) => {
		deleteCookie(event, sessionCookieName, {
			path: '/',
			httpOnly: true,
		});

		/*
		 * TODO: Wird CSRF-Toke-Cookie auf dem echten Server gelöscht? Hier entsprechend angleichen!
		 * deleteCookie(event, csrfCookieName, {
		 * 	path: '/',
		 * 	httpOnly: false,
		 * });
		 */
	}));
});
