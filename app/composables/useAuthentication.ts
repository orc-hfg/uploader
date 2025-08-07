/*
 * Authentication Composable
 *
 * Provides authentication functionality for login, logout, and session validation.
 *
 * IMPORTANT: URL Structure Difference Between Environments
 * - Production: Authentication endpoints at root path (https://server/auth/*)
 * - Local Development: Authentication endpoints under app path (http://localhost:3000/uploader/auth/*)
 *
 * This difference exists because the local authentication mock runs as a Nuxt Server Plugin,
 * which is bound to app.baseURL. The serverUrl configuration handles this difference:
 * - Local: serverUrl = 'http://localhost:3000/uploader/'
 * - Production: serverUrl = 'https://server/'
 *
 * URL Construction:
 * Uses dedicated builder functions with pathSegments arrays for better readability and
 * maintainability.
 */

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

	const csrfToken = useCookie(csrfCookieName);

	function buildAuthenticationSessionUrl(emailOrLogin: string): string {
		const pathSegments = [
			config.public.serverUrl,
			authenticationConfig.basePath,
			authenticationConfig.signInPathName,
			'/',
			authenticationConfig.systemPathName,
		];

		const baseUrl = new URL(pathSegments.join(''));
		baseUrl.searchParams.set(authenticationConfig.emailOrLoginParameter, emailOrLogin);

		return baseUrl.toString();
	}

	function buildSignInUrl(emailOrLogin: string): string {
		const pathSegments = [
			config.public.serverUrl,
			authenticationConfig.basePath,
			authenticationConfig.signInPathName,
			'/',
			authenticationConfig.systemPathName,
			'/',
			authenticationConfig.defaultSystemName,
			'/',
			authenticationConfig.defaultSystemName,
			'/',
			authenticationConfig.signInPathName,
		];

		const baseUrl = new URL(pathSegments.join(''));
		baseUrl.searchParams.set(authenticationConfig.emailOrLoginParameter, emailOrLogin);
		baseUrl.searchParams.set(authenticationConfig.returnToParameter, authenticationConfig.appPathName);

		return baseUrl.toString();
	}

	function buildSignOutUrl(): string {
		const pathSegments = [
			config.public.serverUrl,
			authenticationConfig.basePath,
			authenticationConfig.signOutPathName,
		];

		const baseUrl = new URL(pathSegments.join(''));

		return baseUrl.toString();
	}

	function hasValidCsrfToken(): boolean {
		return typeof csrfToken.value === 'string' && csrfToken.value.length > 0;
	}

	function removeCsrfToken(): void {
		csrfToken.value = undefined;
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
		const authenticationSessionEndpoint = buildAuthenticationSessionUrl(emailOrLogin);

		try {
			await $fetch(authenticationSessionEndpoint);
		}
		catch (error: unknown) {
			handleAuthenticationError(error, 'Session initialization');
		}
	}

	async function login(emailOrLogin: string, password: string): Promise<void> {
		await initializeAuthenticationSession(emailOrLogin);

		if (!hasValidCsrfToken()) {
			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'A valid CSRF token is required for authentication.',
			});
		}

		const signInEndpoint = buildSignInUrl(emailOrLogin);

		try {
			await $fetch(signInEndpoint, {
				headers: {
					[csrfHeaderName]: csrfToken.value ?? '',
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
		const signOutEndpoint = buildSignOutUrl();

		try {
			await $fetch(signOutEndpoint, {
				// TODO: Geht es später auch ohne spezielle Header?
				headers: {
					Accept: 'text/html',
				},
				method: 'GET',
			});

			/*
			 * CSRF Token Cookie Deletion - ACTUAL SOLUTION!
			 * =============================================
			 *
			 * PROBLEM WAS:
			 * The `watch: false` option in useCookie() was preventing cookie deletion.
			 * When watch is false, changes to the reactive ref do NOT sync to the browser cookie.
			 *
			 * SOLUTION:
			 * Remove `watch: false` from useCookie() declaration (defaults to true).
			 * With watch enabled, setting csrfToken.value = null properly deletes the browser cookie.
			 *
			 * KEY INSIGHT FROM NUXT DOCS:
			 * - watch: true (default) → Ref changes automatically sync to browser cookie
			 * - watch: false → Ref changes stay isolated, browser cookie unchanged
			 * - watch: 'shallow' → Only shallow changes sync to browser cookie
			 *
			 * The issue was NOT about cookie options matching server/client,
			 * but about Nuxt's reactive cookie synchronization behavior.
			 */

			/*
			 * TODO: Wird CSRF-Toke-Cookie auf dem echten Server serverseitig gelöscht? Wenn ja, kann das client-seitige Löschen entfallen.
			 * TODO: Wird der Session Cookie auf dem echten Server wie angenommen serverseitig gelöscht oder muss er client-seitig gelöscht werden?
			 */
			removeCsrfToken();
		}
		catch (error: unknown) {
			handleAuthenticationError(error, 'Logout');
		}
	}

	return {
		login,
		logout,
		validateAuthentication,
	};
}
