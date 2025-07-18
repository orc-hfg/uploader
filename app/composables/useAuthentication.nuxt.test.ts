import { TEST_COOKIE } from '@@/shared/constants/test';
import { getCookieMock, getRuntimeConfigMock, getUserRepositoryMock } from '@@/tests/mocks/authentication';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthentication } from './useAuthentication';

describe('useAuthentication()', () => {
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		mockNuxtImport('useRuntimeConfig', () => getRuntimeConfigMock);
		mockNuxtImport('useCookie', () => getCookieMock);
		mockNuxtImport('getUserRepository', () => getUserRepositoryMock);

		fetchSpy = vi.fn();
		vi.stubGlobal('$fetch', fetchSpy);
	});

	afterEach(() => {
		vi.resetAllMocks();
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
