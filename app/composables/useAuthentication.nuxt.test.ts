import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthentication } from './useAuthentication';

const TEST_COOKIE = 'test-cookie';

function getRuntimeConfigMock() {
	return {
		public: {
			serverUrl: 'https://test.server.de/',
			appPathName: 'uploader',
			authentication: {
				basePath: `auth/sign-in/`,
				signInPathName: 'sign-in',
				systemPathName: 'auth-systems',
				systemPath: `auth-systems/`,
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

function getCookieMock() {
	return {
		value: TEST_COOKIE,
	};
}

function getUserRepositoryMock() {
	return {
		getAuthInfo: vi.fn().mockResolvedValue({}),
	};
}

describe('useAuthentication()', () => {
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.resetAllMocks();

		mockNuxtImport('useRuntimeConfig', () => getRuntimeConfigMock);

		mockNuxtImport('useCookie', () => getCookieMock);

		fetchSpy = vi.fn();
		vi.stubGlobal('$fetch', fetchSpy);

		mockNuxtImport('getUserRepository', () => getUserRepositoryMock);
	});

	it('should return true from validateAuthentication when CSRF token exists and getAuthInfo succeeds', async () => {
		const authentication = useAuthentication();

		const result = await authentication.validateAuthentication();

		expect(result).toBe(true);
	});

	it('should call login with correct parameters', async () => {
		const authentication = useAuthentication();
		const testEmail = 'test@example.com';
		const testPassword = 'test-password';

		await authentication.login(testEmail, testPassword);

		expect(fetchSpy).toHaveBeenCalledTimes(2);

		expect(fetchSpy).toHaveBeenNthCalledWith(
			1,
			`https://test.server.de/auth/sign-in/auth-systems/?email-or-login=${encodeURIComponent(testEmail)}`,
		);

		expect(fetchSpy).toHaveBeenNthCalledWith(
			2,
			`https://test.server.de/auth/sign-in/auth-systems/password/password/sign-in?email-or-login=${encodeURIComponent(testEmail)}&return-to=uploader`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'madek.auth.anti-csrf-token': TEST_COOKIE,
				},
				body: {
					password: testPassword,
				},
			},
		);
	});
});
