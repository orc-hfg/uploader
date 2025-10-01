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
 * 3. Client submits sign-in credentials with CSRF token (POST /auth/auth-systems/password/password/sign-in)
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

	const serverStartupLogger = createServerStartupLogger('Plugin: Authentication Mock');

	const { basePath, signInPathName, signOutPathName, systemPathName, defaultSystemName, emailOrLoginParameter, csrfCookieName, csrfHeaderName, sessionCookieName } = authenticationConfig;

	// Build authentication route paths
	const authenticationSystemPath = `/${basePath}${signInPathName}/${systemPathName}`;
	const signInPath = `/${basePath}${signInPathName}/${systemPathName}/${defaultSystemName}/${defaultSystemName}/${signInPathName}`;
	const signOutPath = `/${basePath}${signOutPathName}`;

	nitroApp.router.get(authenticationSystemPath, defineEventHandler((event) => {
		const existingToken = getCookie(event, csrfCookieName);

		// Only generate new token if none exists
		if (existingToken === undefined) {
			const newToken = generateCsrfToken();
			serverStartupLogger.info('Session initialization - Generating new token:', newToken);

			setCookie(event, csrfCookieName, newToken, {
				path: '/',
				httpOnly: false,
			});
		}
		else {
			serverStartupLogger.info('Session initialization - Reusing existing token:', existingToken);
		}
	}));

	nitroApp.router.post(signInPath, defineEventHandler(async (event) => {
		const body = await readBody<SignInRequestBody>(event);
		const query = getQuery(event);
		const loginValue = query[emailOrLoginParameter] ?? '';

		const csrfToken = (getCookie(event, csrfCookieName) ?? '').toLocaleLowerCase();
		const csrfHeader = (getHeader(event, csrfHeaderName) ?? '').toLocaleLowerCase();

		if (csrfToken !== csrfHeader) {
			serverStartupLogger.info('Invalid CSRF token provided.', { csrfToken, csrfHeader });

			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'The CSRF token does not match.',
			});
		}

		if (loginValue !== AUTHENTICATION_MOCK_VALID_USER.login || body.password !== AUTHENTICATION_MOCK_VALID_USER_PASSWORD) {
			serverStartupLogger.info('Invalid credentials provided.', { login: loginValue, password: body.password });

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

	nitroApp.router.get(signOutPath, defineEventHandler((event) => {
		// TODO: Is the session cookie deleted server-side on the real server? Otherwise adjust the behavior in this mock accordingly!
		deleteCookie(event, sessionCookieName, {
			path: '/',
			httpOnly: true,
		});

		/*
		 * TODO: Is the session cookie deleted server-side on the real server? Otherwise adjust the behavior in this mock accordingly!
		 * deleteCookie(event, csrfCookieName, {
		 * 	path: '/',
		 * 	httpOnly: false,
		 * });
		 */
	}));
});
