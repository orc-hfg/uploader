/*
 * Authentication Composable
 *
 * Provides authentication functionality for sign-in, sign-out, and session validation.
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
	signIn: (emailOrLogin: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
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
	const { basePath, signInPathName, signOutPathName, systemPathName, defaultSystemName, appPathName, emailOrLoginParameter, returnToParameter, csrfCookieName, csrfHeaderName } = authenticationConfig;

	const csrfToken = useCookie(csrfCookieName);

	const appLogger = createAppLogger('Composable: Authentication');

	function buildServerUrl(path: string): URL {
		return new URL(path, config.public.serverUrl);
	}

	function buildAuthenticationSystemUrl(emailOrLogin: string): string {
		const path = `${basePath}${signInPathName}/${systemPathName}`;
		const url = buildServerUrl(path);

		url.searchParams.set(emailOrLoginParameter, emailOrLogin);

		return url.toString();
	}

	function buildSignInUrl(emailOrLogin: string): string {
		const path = `${basePath}${signInPathName}/${systemPathName}/${defaultSystemName}/${defaultSystemName}/${signInPathName}`;
		const url = buildServerUrl(path);

		url.searchParams.set(emailOrLoginParameter, emailOrLogin);
		url.searchParams.set(returnToParameter, appPathName);

		return url.toString();
	}

	function buildSignOutUrl(): string {
		const path = `${basePath}${signOutPathName}`;
		const url = buildServerUrl(path);

		return url.toString();
	}

	function hasNonEmptyCsrfToken(): boolean {
		return typeof csrfToken.value === 'string' && csrfToken.value.length > 0;
	}

	function removeCsrfToken(): void {
		csrfToken.value = undefined;
	}

	async function validateAuthentication(): Promise<boolean> {
		if (!hasNonEmptyCsrfToken()) {
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

	async function prepareSignIn(emailOrLogin: string): Promise<void> {
		appLogger.debug('Current CSRF token before request:', csrfToken.value);

		const authenticationSystemEndpoint = buildAuthenticationSystemUrl(emailOrLogin);

		try {
			await $fetch(authenticationSystemEndpoint);

			appLogger.debug('New CSRF token after request:', csrfToken.value);
		}
		catch (error: unknown) {
			handleAuthenticationError(error, 'Session initialization');
		}
	}

	async function signIn(emailOrLogin: string, password: string): Promise<void> {
		await prepareSignIn(emailOrLogin);

		appLogger.debug('CSRF token before validation:', csrfToken.value);

		if (!hasNonEmptyCsrfToken()) {
			throw createError({
				statusCode: StatusCodes.FORBIDDEN,
				statusMessage: 'A valid CSRF token is required for authentication.',
			});
		}

		const signInEndpoint = buildSignInUrl(emailOrLogin);

		const tokenToSend = csrfToken.value;
		appLogger.debug('Sending sign-in request with CSRF token:', tokenToSend);

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
			handleAuthenticationError(error, 'Sign-in');
		}
	}

	async function signOut(): Promise<void> {
		const signOutEndpoint = buildSignOutUrl();

		try {
			await $fetch(signOutEndpoint, {
				// TODO: Will this work later without special headers?
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
			 * TODO: Is the CSRF token cookie deleted server-side on the real server? If yes, client-side deletion can be omitted.
			 * TODO: Is the session cookie deleted server-side on the real server as assumed, or must it be deleted client-side?
			 */
			removeCsrfToken();
		}
		catch (error: unknown) {
			handleAuthenticationError(error, 'Sign-out');
		}
	}

	return {
		signIn,
		signOut,
		validateAuthentication,
	};
}
