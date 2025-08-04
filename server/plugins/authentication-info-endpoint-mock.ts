import { AUTHENTICATION_MOCK_SESSION_PREFIX, AUTHENTICATION_MOCK_VALID_USER } from '@@/shared/constants/test';
import { StatusCodes } from 'http-status-codes';

const serverStartupLogger = createServerStartupLogger();

const config = useRuntimeConfig();
const publicConfig = config.public;

const isAuthenticationInfoEndpointMockEnabled = publicConfig.enableAuthenticationInfoEndpointMock;

if (isAuthenticationInfoEndpointMockEnabled) {
	serverStartupLogger.info('Plugin: authentication-info-endpoint-mock', 'Authentication info endpoint mock is active.');
}

/*
 * Authentication Info Endpoint Mock Plugin
 *
 * This plugin provides a mock /api/auth-info endpoint for development and testing environments.
 *
 * WHEN ACTIVE:
 * - Preview/CI environment (npm run preview) - for E2E testing with session-based authentication
 * - NOT active in development environment (npm run dev) - uses token-based authentication
 *
 * PROVIDES:
 * - GET /api/auth-info - Returns user information based on session cookie
 *
 * AUTHENTICATION FLOW:
 * 1. Client has session cookie from previous login
 * 2. Client requests user info from this endpoint
 * 3. Plugin validates session cookie and returns user data
 */

export default defineNitroPlugin((nitroApp) => {
	if (!isAuthenticationInfoEndpointMockEnabled) {
		return;
	}

	nitroApp.router.get('/api/auth-info', defineEventHandler((event) => {
		const { sessionCookieName } = publicConfig.authentication;
		const sessionCookie = getCookie(event, sessionCookieName);

		if (!sessionCookie?.startsWith(AUTHENTICATION_MOCK_SESSION_PREFIX)) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: 'The session is invalid or has expired.',
			});
		}

		const userId = sessionCookie.replace(AUTHENTICATION_MOCK_SESSION_PREFIX, '');

		if (userId !== AUTHENTICATION_MOCK_VALID_USER.id) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: 'The session is invalid or has expired.',
			});
		}

		return {
			user: AUTHENTICATION_MOCK_VALID_USER,
		};
	}));
});
