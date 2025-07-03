import { randomBytes } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';

// Activate this authentication mock only in development (localhost server) and test environments
const shouldActivateAuthenticationMock = import.meta.dev || import.meta.test;

if (shouldActivateAuthenticationMock) {
	const logger = createLogger();

	logger.info('Plugin: authentication-mock', 'Authentication mock is active.');
}

const config = useRuntimeConfig();
const authenticationConfig = config.public.authentication;

interface SignInRequestBody {
	login: string;
	password: string;
}

interface AuthenticationMockUser {
	id: string;
	login: string;
}

const TEST_USER_PASSWORD = '123';

const TEST_USER: AuthenticationMockUser = {
	login: 'test',
	id: 'test-123',
};

function generateCsrfToken(): string {
	const CSRF_TOKEN_BYTES = 12;

	return `mock-csrf-${randomBytes(CSRF_TOKEN_BYTES).toString('base64url')}`;
}

export default defineNitroPlugin((nitroApp) => {
	if (!shouldActivateAuthenticationMock) {
		return;
	}

	const logger = createLogger();

	const CSRF_COOKIE = 'madek.auth.anti-csrf-token';
	const CSRF_HEADER = 'madek.auth.anti-csrf-token';
	const SESSION_COOKIE = 'madek-session';
	const SESSION_MAX_AGE_SECONDS = 86_400;
	const EMAIL_OR_LOGIN_PARAM = 'email-or-login';

	nitroApp.router.get(`/${authenticationConfig.basePath}${authenticationConfig.systemPathName}`, defineEventHandler((event) => {
		logger.info('Plugin: authentication-mock', `GET ${getRequestURL(event).pathname}`);

		setCookie(event, CSRF_COOKIE, generateCsrfToken(), {
			path: '/',
			httpOnly: false,
		});
	}));

	nitroApp.router.post(`/${authenticationConfig.basePath}${authenticationConfig.systemPath}${authenticationConfig.defaultSystemName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.signInPathName}`, defineEventHandler(async (event) => {
		logger.info('Plugin: authentication-mock', `POST ${getRequestURL(event).pathname}`);

		const body = await readBody<SignInRequestBody>(event);
		const query = getQuery(event);
		const loginValue = query[EMAIL_OR_LOGIN_PARAM] ?? '';

		const csrfToken = (getCookie(event, CSRF_COOKIE) ?? '').toLowerCase();
		const csrfHeader = (getHeader(event, CSRF_HEADER) ?? '').toString().toLowerCase();

		if (csrfToken !== csrfHeader) {
			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'The CSRF token does not match.',
			});
		}

		if (loginValue !== TEST_USER.login || body.password !== TEST_USER_PASSWORD) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: 'The provided credentials are invalid.',
			});
		}

		setCookie(event, SESSION_COOKIE, `mock-session-${TEST_USER.id}`, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: SESSION_MAX_AGE_SECONDS,
		});
	}));
});
