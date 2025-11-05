import type { PublicRuntimeConfig } from 'nuxt/schema';
import { AUTHENTICATION_TEST_COOKIE } from '@@/shared/constants/test';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { vi } from 'vitest';

interface RuntimeConfigMock {
	public: Partial<PublicRuntimeConfig>;
}

interface CookieMock {
	value: string | null | undefined;
}

interface UserRepositoryMock {
	getAuthInfo: ReturnType<typeof vi.fn>;
}

interface AuthenticationTestContext {
	fetchMock: ReturnType<typeof vi.fn>;
	[Symbol.dispose]: () => void;
}

export function getRuntimeConfigMock(): RuntimeConfigMock {
	return {
		public: {
			serverUrl: 'https://test.server.de/',
			authentication: {
				appPathName: 'uploader',
				basePath: 'auth/',
				signInPathName: 'sign-in',
				signOutPathName: 'sign-out',
				systemPathName: 'auth-systems',
				defaultSystemName: 'password',
				emailOrLoginParameter: 'email-or-login',
				returnToParameter: 'return-to',
				csrfCookieName: 'madek.auth.anti-csrf-token',
				csrfHeaderName: 'madek.auth.anti-csrf-token',
				sessionCookieName: 'madek-session',
			},
		},
	};
}

export const getCookieMock = vi.fn<() => CookieMock>().mockReturnValue({
	value: AUTHENTICATION_TEST_COOKIE,
});

export const getUserRepositoryMock = vi.fn<() => UserRepositoryMock>().mockReturnValue({
	getAuthInfo: vi.fn().mockResolvedValue({}),
});

// Wrapper functions to avoid recreation on each test context setup
function useCookieMock(): CookieMock {
	return getCookieMock();
}

function userRepositoryMock(): UserRepositoryMock {
	return getUserRepositoryMock();
}

/*
 * Authentication Test Context with Explicit Resource Management
 *
 * This context implements the Disposable pattern (Node 24+, TypeScript 5.2+) via [Symbol.dispose].
 * When used with the `using` keyword, cleanup is automatically triggered at the end of the scope.
 *
 * Example:
 *   using context = setupAuthenticationTestContext();
 *   // Test code here...
 *   // Cleanup (vi.restoreAllMocks, vi.unstubAllGlobals) happens automatically!
 *
 * See readme.testing.md → Explicit Resource Management for details.
 */
export function setupAuthenticationTestContext(): AuthenticationTestContext {
	// Setup Nuxt import mocks
	mockNuxtImport('useRuntimeConfig', () => getRuntimeConfigMock);
	mockNuxtImport('useCookie', () => useCookieMock);
	mockNuxtImport('getUserRepository', () => userRepositoryMock);

	// Setup global $fetch mock
	const fetchMock = vi.fn();
	vi.stubGlobal('$fetch', fetchMock);

	function cleanup(): void {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	}

	return {
		fetchMock,
		[Symbol.dispose]: cleanup,
	};
}
