import type { CookieRef } from '#app';
import { StatusCodes } from 'http-status-codes';
import { FetchError } from 'ofetch';

interface UseAuthenticationReturn {
	login: (emailOrLogin: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	validateAuthentication: () => Promise<boolean>;
}

function handleAuthenticationError(error: unknown, operationName: string): never {
	if (error instanceof FetchError) {
		const responseStatus = error.response?.status;
		const statusCode = typeof responseStatus === 'number' ? responseStatus : StatusCodes.BAD_REQUEST;

		throw createError({
			statusCode,
			statusMessage: `${operationName} failed. Error: ${error.message || 'Unknown error'}`,
		});
	}

	throw createError({
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
		statusMessage: `${operationName} failed due to an unexpected error.`,
	});
}

export function useAuthentication(): UseAuthenticationReturn {
	const config = useRuntimeConfig();
	const authenticationConfig = config.public.authentication;
	const { csrfCookieName, csrfHeaderName } = authenticationConfig;

	const authenticationEndpoint = `${config.public.serverUrl}${authenticationConfig.basePath}`;
	const authenticationSystemEndpoint = `${authenticationEndpoint}${authenticationConfig.systemPath}`;

	function getCsrfToken(): CookieRef<string | null | undefined> {
		return useCookie(csrfCookieName, { watch: false });
	}

	function hasValidCsrfToken(): boolean {
		const token = getCsrfToken().value;

		return typeof token === 'string' && token.length > 0;
	}

	async function validateAuthentication(): Promise<boolean> {
		if (!hasValidCsrfToken()) {
			return false;
		}

		try {
			await getUserRepository().getAuthInfo();

			return true;
		}
		catch {
			return false;
		}
	}

	async function initializeAuthenticationSession(emailOrLogin: string): Promise<void> {
		const authenticationSessionEndpoint = `${authenticationSystemEndpoint}?${authenticationConfig.emailOrLoginParameter}=${encodeURIComponent(emailOrLogin)}`;

		try {
			await $fetch(authenticationSessionEndpoint);
		}
		catch (error: unknown) {
			handleAuthenticationError(error, 'Session initialization');
		}
	}

	async function login(emailOrLogin: string, password: string): Promise<void> {
		await initializeAuthenticationSession(emailOrLogin);

		const csrfToken = getCsrfToken();
		const csrfTokenValue = csrfToken.value ?? '';

		if (!csrfTokenValue) {
			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'A valid CSRF token is required for authentication.',
			});
		}

		const signInEndpoint = `${authenticationSystemEndpoint}${authenticationConfig.defaultSystemName}/${authenticationConfig.defaultSystemName}/${authenticationConfig.signInPathName}?${authenticationConfig.emailOrLoginParameter}=${encodeURIComponent(emailOrLogin)}&${authenticationConfig.returnToParameter}=${authenticationConfig.appPathName}`;

		try {
			await $fetch(signInEndpoint, {
				headers: {
					[csrfHeaderName]: csrfTokenValue,
				},
				method: 'POST',
				body: {
					password,
				},
			});
		}
		catch (error: unknown) {
			handleAuthenticationError(error, 'Login');
		}
	}

	async function logout(): Promise<void> {
		const signOutEndpoint = `${authenticationEndpoint}${authenticationConfig.signOutPathName}`;

		try {
			await $fetch(signOutEndpoint, {
				headers: {
					Accept: 'text/html',
				},
				method: 'GET',
			});
		}
		catch (error: unknown) {
			handleAuthenticationError(error, 'Logout');
		}

		const csrfToken = getCsrfToken();
		csrfToken.value = undefined;
	}

	return {
		login,
		logout,
		validateAuthentication,
	};
}
