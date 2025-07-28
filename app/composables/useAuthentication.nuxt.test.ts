import { AUTHENTICATION_TEST_COOKIE } from '@@/shared/constants/test';
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
		vi.clearAllMocks();
	});

	describe('validateAuthentication', () => {
		it('should return true when CSRF token exists and getAuthInfo succeeds', async () => {
			const authentication = useAuthentication();

			const result = await authentication.validateAuthentication();

			expect(result).toBe(true);
		});

		it('should return false when CSRF token is null', async () => {
			// eslint-disable-next-line unicorn/no-null
			vi.mocked(getCookieMock).mockReturnValue({ value: null });

			const authentication = useAuthentication();

			const result = await authentication.validateAuthentication();

			expect(result).toBe(false);
		});

		it('should return false when CSRF token is undefined', async () => {
			vi.mocked(getCookieMock).mockReturnValue({ value: undefined });

			const authentication = useAuthentication();

			const result = await authentication.validateAuthentication();

			expect(result).toBe(false);
		});

		it('should return false when CSRF token is empty string', async () => {
			vi.mocked(getCookieMock).mockReturnValue({ value: '' });

			const authentication = useAuthentication();

			const result = await authentication.validateAuthentication();

			expect(result).toBe(false);
		});

		it('should return false when getAuthInfo throws an error', async () => {
			const mockGetAuthInfo = vi.fn().mockRejectedValue(new Error('API Error'));
			vi.mocked(getCookieMock).mockReturnValue({ value: AUTHENTICATION_TEST_COOKIE });
			vi.mocked(getUserRepositoryMock).mockReturnValue({
				getAuthInfo: mockGetAuthInfo,
			});

			const authentication = useAuthentication();

			const result = await authentication.validateAuthentication();

			expect(result).toBe(false);
			expect(mockGetAuthInfo).toHaveBeenCalledTimes(1);
		});

		it('should call getUserRepository.getAuthInfo when CSRF token is valid', async () => {
			const mockGetAuthInfo = vi.fn().mockResolvedValue({});
			vi.mocked(getCookieMock).mockReturnValue({ value: AUTHENTICATION_TEST_COOKIE });
			vi.mocked(getUserRepositoryMock).mockReturnValue({
				getAuthInfo: mockGetAuthInfo,
			});

			const authentication = useAuthentication();

			const result = await authentication.validateAuthentication();

			expect(result).toBe(true);
			expect(mockGetAuthInfo).toHaveBeenCalledTimes(1);
		});

		it('should not call getUserRepository.getAuthInfo when CSRF token is invalid', async () => {
			const mockGetAuthInfo = vi.fn();
			// eslint-disable-next-line unicorn/no-null
			vi.mocked(getCookieMock).mockReturnValue({ value: null });
			vi.mocked(getUserRepositoryMock).mockReturnValue({
				getAuthInfo: mockGetAuthInfo,
			});

			const authentication = useAuthentication();

			await authentication.validateAuthentication();

			expect(mockGetAuthInfo).not.toHaveBeenCalled();
		});
	});

	it('should call login with correct parameters', async () => {
		vi.mocked(getCookieMock).mockReturnValue({ value: AUTHENTICATION_TEST_COOKIE });

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
					'madek.auth.anti-csrf-token': AUTHENTICATION_TEST_COOKIE,
				},
				body: {
					password: testPassword,
				},
			},
		);
	});
});
