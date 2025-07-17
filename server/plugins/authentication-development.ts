import { randomBytes } from 'node:crypto';
import { TEST_USER_LOGIN, TEST_USER_PASSWORD } from '@@/shared/constants/test';
import { StatusCodes } from 'http-status-codes';

const isDevelopment = import.meta.dev;

if (isDevelopment) {
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

const TEST_USER: AuthenticationMockUser = {
	login: TEST_USER_LOGIN,
	id: 'test-123',
};

function generateCsrfToken(): string {
	const CSRF_TOKEN_BYTES = 12;

	return `mock-csrf-${randomBytes(CSRF_TOKEN_BYTES).toString('base64url')}`;
}

export default defineNitroPlugin((nitroApp) => {
	if (!isDevelopment) {
		return;
	}

	const logger = createLogger();

	const { emailOrLoginParameter, csrfCookieName, csrfHeaderName, sessionCookieName } = authenticationConfig;
	const sessionMaxAgeSeconds = 86_400;

	// E.g. GET https://dev.madek.hfg-karlsruhe.de/auth/sign-in/auth-systems/?email-or-login=test
	nitroApp.router.get(`/${authenticationConfig.basePath}${authenticationConfig.systemPathName}`, defineEventHandler((event) => {
		logger.info('Plugin: authentication-mock', `GET ${getRequestURL(event).pathname}`);

		setCookie(event, csrfCookieName, generateCsrfToken(), {
			path: '/',
			httpOnly: false,
		});
	}));

	// E.g. POST https://dev.madek.hfg-karlsruhe.de/auth/sign-in/auth-systems/password/password/sign-in?email-or-login=test&return-to=uploader
	nitroApp.router.post(`/${authenticationConfig.basePath}${authenticationConfig.systemPath}${authenticationConfig.defaultSystemName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.signInPathName}`, defineEventHandler(async (event) => {
		logger.info('Plugin: authentication-mock', `POST ${getRequestURL(event).pathname}`);

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

		if (loginValue !== TEST_USER.login || body.password !== TEST_USER_PASSWORD) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: 'The provided credentials are invalid.',
			});
		}

		setCookie(event, sessionCookieName, `mock-session-${TEST_USER.id}`, {
			path: '/',
			httpOnly: true,
			maxAge: sessionMaxAgeSeconds,
		});
	}));
});
