import { randomBytes } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';

if (import.meta.dev || import.meta.test) {
	console.info('[AUTHENTICATION MOCK] Authentication mock is active');
}

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
	if (!(import.meta.dev || import.meta.test)) {
		return;
	}

	const CSRF_COOKIE = 'madek.auth.anti-csrf-token';
	const CSRF_HEADER = 'madek.auth.anti-csrf-token';
	const SESSION_COOKIE = 'madek.session';
	const SESSION_MAX_AGE_SECONDS = 86_400;
	const EMAIL_OR_LOGIN_PARAM = 'email-or-login';

	nitroApp.router.get('/auth/sign-in/auth-systems', defineEventHandler((event) => {
		console.info(`[AUTHENTICATION MOCK] GET ${getRequestURL(event).pathname}`);

		setCookie(event, CSRF_COOKIE, generateCsrfToken(), {
			path: '/',
			httpOnly: false,
		});

		return {
			auth_system: 'password',
		};
	}));

	nitroApp.router.post('/auth/sign-in/auth-systems/password/password/sign-in', defineEventHandler(async (event) => {
		console.info(`[AUTHENTICATION MOCK] POST ${getRequestURL(event).pathname}`);

		const body = await readBody<SignInRequestBody>(event);
		const query = getQuery(event);
		const loginValue = query[EMAIL_OR_LOGIN_PARAM] ?? '';

		const csrfToken = (getCookie(event, CSRF_COOKIE) ?? '').toLowerCase();
		const csrfHeader = (getHeader(event, CSRF_HEADER) ?? '').toString().toLowerCase();

		if (csrfToken !== csrfHeader) {
			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'CSRF token mismatch',
			});
		}

		if (loginValue !== TEST_USER.login || body.password !== TEST_USER_PASSWORD) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: 'Invalid credentials',
			});
		}

		setCookie(event, SESSION_COOKIE, `mock-session-${TEST_USER.id}`, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: SESSION_MAX_AGE_SECONDS,
		});

		return {
			status: 'ok',
			data: {
				user: TEST_USER.login,
			},
		};
	}));
});
