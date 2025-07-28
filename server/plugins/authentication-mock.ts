import { randomBytes } from 'node:crypto';
import { AUTHENTICATION_MOCK_SESSION_PREFIX, AUTHENTICATION_MOCK_VALID_USER, AUTHENTICATION_MOCK_VALID_USER_PASSWORD } from '@@/shared/constants/test';
import { ONE_DAY_IN_SECONDS } from '@orc-hfg/madek-api-nuxt-layer/shared/constants/time';
import { StatusCodes } from 'http-status-codes';

const logger = createLogger();

const config = useRuntimeConfig();
const publicConfig = config.public;
const authenticationConfig = publicConfig.authentication;

const isAuthenticationMockEnabled = publicConfig.enableAuthenticationMock;

if (isAuthenticationMockEnabled) {
	logger.info('Plugin: authentication-mock', 'Authentication mock is active.');
}

/*
 * Authentication Mock Plugin
 *
 * This plugin provides mock authentication endpoints for development and testing environments.
 *
 * WHEN ACTIVE:
 * - Development environment (npm run dev) - for local development without external server
 * - Preview/CI environment (npm run preview:ci) - for E2E testing with session-based authentication
 *
 * PROVIDES:
 * - GET /auth/sign-in/auth-systems/ - Returns CSRF token for authentication
 * - POST /auth/sign-in/auth-systems/password/password/sign-in - Validates credentials and sets session cookie
 *
 * AUTHENTICATION FLOW:
 * 1. Client requests CSRF token from GET endpoint
 * 2. Client submits login form with CSRF token in header
 * 3. Plugin validates credentials and CSRF token
 * 4. On success, sets session cookie for subsequent requests
 */

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
	const getSystemPath = `/${authenticationConfig.basePath}${authenticationConfig.systemPathName}`;
	const postSignInPath = `/${authenticationConfig.basePath}${authenticationConfig.systemPathName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.signInPathName}`;
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
			maxAge: ONE_DAY_IN_SECONDS,
		});
	}));

	nitroApp.router.get(getSignOutPath, defineEventHandler((event) => {
		deleteCookie(event, sessionCookieName, {
			path: '/',
			httpOnly: true,
		});

		deleteCookie(event, csrfCookieName, {
			path: '/',
			httpOnly: false,
		});
	}));
});
