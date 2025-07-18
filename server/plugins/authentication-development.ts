import { randomBytes } from 'node:crypto';
import process from 'node:process';
import { VALID_USER_LOGIN, VALID_USER_PASSWORD } from '@@/shared/constants/test';
import { StatusCodes } from 'http-status-codes';

// Enable authentication mock for development AND testing (E2E tests)
const shouldEnableAuthenticationMock = import.meta.dev || process.env.CI === 'true';

if (shouldEnableAuthenticationMock) {
	const logger = createLogger();

	logger.debug('Plugin: authentication-development', 'META ENV CI', import.meta.env.CI);

	logger.info('Plugin: authentication-development', 'Authentication development plugin is active.');
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

const VALID_USER: AuthenticationMockUser = {
	login: VALID_USER_LOGIN,
	id: 'test-123',
};

function generateCsrfToken(): string {
	const CSRF_TOKEN_BYTES = 12;

	return `mock-csrf-${randomBytes(CSRF_TOKEN_BYTES).toString('base64url')}`;
}

export default defineNitroPlugin((nitroApp) => {
	if (!shouldEnableAuthenticationMock) {
		return;
	}

	const logger = createLogger();

	logger.debug('Plugin: authentication-development', 'Setting up authentication routes...');

	const { emailOrLoginParameter, csrfCookieName, csrfHeaderName } = authenticationConfig;

	const getSystemPath = `/${authenticationConfig.basePath}${authenticationConfig.systemPathName}`;
	const postSignInPath = `/${authenticationConfig.basePath}${authenticationConfig.systemPath}${authenticationConfig.defaultSystemName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.signInPathName}`;

	logger.debug('Plugin: authentication-development', `GET route: ${getSystemPath}`);
	logger.debug('Plugin: authentication-development', `POST route: ${postSignInPath}`);

	// E.g. GET https://dev.madek.hfg-karlsruhe.de/auth/sign-in/auth-systems/?email-or-login=test
	nitroApp.router.get(getSystemPath, defineEventHandler((event) => {
		logger.debug('Plugin: authentication-development', `GET ${getRequestURL(event).pathname}`);

		setCookie(event, csrfCookieName, generateCsrfToken(), {
			path: '/',
			httpOnly: false,
		});
	}));

	// E.g. POST https://dev.madek.hfg-karlsruhe.de/auth/sign-in/auth-systems/password/password/sign-in?email-or-login=test&return-to=uploader
	nitroApp.router.post(postSignInPath, defineEventHandler(async (event) => {
		logger.debug('Plugin: authentication-development', `POST ${getRequestURL(event).pathname}`);

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

		if (loginValue !== VALID_USER.login || body.password !== VALID_USER_PASSWORD) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: 'The provided credentials are invalid.',
			});
		}
	}));
});
