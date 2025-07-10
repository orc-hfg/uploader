import type { CookieRef } from '#app';
import { StatusCodes } from 'http-status-codes';
import { FetchError } from 'ofetch';

interface UseAuthenticationReturn {
	login: (emailOrLogin: string, password: string) => Promise<void>;
	validateAuthentication: () => Promise<boolean>;
}

export function useAuthentication(): UseAuthenticationReturn {
	const config = useRuntimeConfig();
	const authenticationConfig = config.public.authentication;
	const { csrfCookieName, csrfHeaderName } = authenticationConfig;

	const authenticationSystemEndpoint = `${config.public.serverUrl}${authenticationConfig.basePath}${authenticationConfig.systemPath}`;

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

	function buildAuthenticationEndpoint(authenticationSystem: string, authenticationAction: string, emailOrLogin: string): string {
		const endpoint = `${authenticationSystemEndpoint}${authenticationSystem}/${authenticationSystem}/${authenticationAction}?${authenticationConfig.emailOrLoginParameter}=${encodeURIComponent(emailOrLogin)}&${authenticationConfig.returnToParameter}=${authenticationConfig.appPathName}`;

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
					[csrfHeaderName]: csrfTokenValue,
					'Content-Type': 'application/json',
				},
				method: 'POST',
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
		validateAuthentication,
	};
}
