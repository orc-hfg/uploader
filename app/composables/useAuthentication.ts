import type { CookieRef } from '#app';
import { StatusCodes } from 'http-status-codes';
import { FetchError } from 'ofetch';

interface UseAuthenticationReturn {
	login: (emailOrLogin: string, password: string) => Promise<void>;
	hasValidCookies: () => boolean;
}

const CSRF_COOKIE_NAME = 'madek.auth.anti-csrf-token';
const SESSION_COOKIE_NAME = 'madek-session';

function getCsrfToken(): CookieRef<string | null | undefined> {
	const csrfToken = useCookie(CSRF_COOKIE_NAME, { watch: false });

	if (typeof csrfToken.value === 'string' && csrfToken.value.length > 0) {
		return csrfToken;
	}

	throw createError({
		statusCode: StatusCodes.FORBIDDEN,
		statusMessage: 'The CSRF token is missing.',
	});
}

function hasValidCookies(): boolean {
	const logger = createLogger();

	try {
		const csrfCookie = useCookie(CSRF_COOKIE_NAME, { watch: false });
		const sessionCookie = useCookie(SESSION_COOKIE_NAME, { watch: false });

		logger.debug('Composable: useAuthentication', 'Checking authentication cookies.', {
			csrfCookieValue: csrfCookie.value,
			sessionCookieValue: sessionCookie.value,
		});

		const hasValidAuthenticationCookies = typeof csrfCookie.value === 'string'
			&& csrfCookie.value.length > 0
			&& typeof sessionCookie.value === 'string'
			&& sessionCookie.value.length > 0;

		return hasValidAuthenticationCookies;
	}
	catch (error) {
		logger.error('Composable: useAuthentication', 'Error checking authentication status.', error);

		return false;
	}
}

export function useAuthentication(): UseAuthenticationReturn {
	const config = useRuntimeConfig();

	const APP_PATH_NAME = config.public.appPathName;
	const authenticationConfig = config.public.authentication;
	const authenticationSystemEndpoint = `${config.public.serverUrl}${authenticationConfig.basePath}${authenticationConfig.systemPath}`;

	function buildAuthenticationEndpoint(authenticationSystem: string, authenticationAction: string, emailOrLogin: string): string {
		const endpoint = `${authenticationSystemEndpoint}${authenticationSystem}/${authenticationSystem}/${authenticationAction}?${authenticationConfig.emailOrLoginParameter}=${encodeURIComponent(emailOrLogin)}&${authenticationConfig.returnToParameter}=${APP_PATH_NAME}`;

		return endpoint;
	}

	async function initializeAuthenticationSession(emailOrLogin: string): Promise<void> {
		const authenticationSessionEndpoint = `${authenticationSystemEndpoint}?${authenticationConfig.emailOrLoginParameter}=${encodeURIComponent(emailOrLogin)}`;

		try {
			await $fetch(authenticationSessionEndpoint);
		}
		catch (error: unknown) {
			if (error instanceof FetchError) {
				const responseStatus = error.response?.status;
				const statusCode = typeof responseStatus === 'number' ? responseStatus : StatusCodes.BAD_REQUEST;

				throw createError({
					statusCode,
					statusMessage: `Session initialization failed. Error: ${error.message || 'Unknown error'}`,
				});
			}

			throw createError({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				statusMessage: 'Session initialization failed due to an unexpected error.',
			});
		}
	}

	async function login(emailOrLogin: string, password: string): Promise<void> {
		await initializeAuthenticationSession(emailOrLogin);

		const authenticationSystem = authenticationConfig.defaultSystemName;

		const csrfToken = getCsrfToken();

		const csrfTokenValue = csrfToken.value ?? '';
		if (!csrfTokenValue) {
			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'A valid CSRF token is required for authentication.',
			});
		}

		const signInEndpoint = buildAuthenticationEndpoint(authenticationSystem, authenticationConfig.signInPathName, emailOrLogin);

		try {
			await $fetch(signInEndpoint, {
				headers: {
					'madek.auth.anti-csrf-token': csrfTokenValue,
					'Content-Type': 'application/json',
				},
				method: 'POST',
				credentials: 'include',
				body: { password },
			});
		}
		catch (error: unknown) {
			if (error instanceof FetchError) {
				const responseStatus = error.response?.status;
				const statusCode = typeof responseStatus === 'number' ? responseStatus : StatusCodes.BAD_REQUEST;

				throw createError({
					statusCode,
					statusMessage: `Authentication failed. Error: ${error.message || 'Unknown error'}`,
				});
			}

			throw createError({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				statusMessage: 'Authentication failed due to an unexpected error.',
			});
		}
	}

	return {
		login,
		hasValidCookies,
	};
}
