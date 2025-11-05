import { AUTHENTICATION_TEST_COOKIE } from '@@/shared/constants/test';
import { getCookieMock, getUserRepositoryMock, setupAuthenticationTestContext } from '@@/tests/mocks/authentication';
import { describe, expect, it, vi } from 'vitest';
import { useAuthentication } from './useAuthentication';

/*
 * Note: Tests use the `using` keyword (Node 24+, TypeScript 5.2+) for automatic resource cleanup.
 * The test context is automatically disposed at the end of each test, even if assertions fail.
 * See readme.testing.md → Explicit Resource Management for details.
 */

describe('useAuthentication()', () => {
	describe('validateAuthentication', () => {
		it('should return true when CSRF token exists and getAuthInfo succeeds', async () => {
			using context = setupAuthenticationTestContext();

			const { validateAuthentication } = useAuthentication();

			const result = await validateAuthentication();

			expect(result).toBe(true);
			expect(context.fetchMock).toBeDefined();
		});

		it('should return false when CSRF token is null', async () => {
			using context = setupAuthenticationTestContext();

			vi.mocked(getCookieMock).mockReturnValue({ value: null });

			const { validateAuthentication } = useAuthentication();

			const result = await validateAuthentication();

			expect(result).toBe(false);
			expect(context.fetchMock).toBeDefined();
		});

		it('should return false when CSRF token is undefined', async () => {
			using context = setupAuthenticationTestContext();

			vi.mocked(getCookieMock).mockReturnValue({ value: undefined });

			const { validateAuthentication } = useAuthentication();

			const result = await validateAuthentication();

			expect(result).toBe(false);
			expect(context.fetchMock).toBeDefined();
		});

		it('should return false when CSRF token is empty string', async () => {
			using context = setupAuthenticationTestContext();

			vi.mocked(getCookieMock).mockReturnValue({ value: '' });

			const { validateAuthentication } = useAuthentication();

			const result = await validateAuthentication();

			expect(result).toBe(false);
			expect(context.fetchMock).toBeDefined();
		});

		it('should return false when getAuthInfo throws an error', async () => {
			using context = setupAuthenticationTestContext();

			const mockGetAuthInfo = vi.fn().mockRejectedValue(new Error('API Error'));

			vi.mocked(getCookieMock).mockReturnValue({ value: AUTHENTICATION_TEST_COOKIE });
			vi.mocked(getUserRepositoryMock).mockReturnValue({
				getAuthInfo: mockGetAuthInfo,
			});

			const { validateAuthentication } = useAuthentication();

			const result = await validateAuthentication();

			expect(result).toBe(false);
			expect(mockGetAuthInfo).toHaveBeenCalledTimes(1);
			expect(context.fetchMock).toBeDefined();
		});

		it('should call getUserRepository.getAuthInfo when CSRF token is valid', async () => {
			using context = setupAuthenticationTestContext();

			const mockGetAuthInfo = vi.fn().mockResolvedValue({});

			vi.mocked(getCookieMock).mockReturnValue({ value: AUTHENTICATION_TEST_COOKIE });
			vi.mocked(getUserRepositoryMock).mockReturnValue({
				getAuthInfo: mockGetAuthInfo,
			});

			const { validateAuthentication } = useAuthentication();

			const result = await validateAuthentication();

			expect(result).toBe(true);
			expect(mockGetAuthInfo).toHaveBeenCalledTimes(1);
			expect(context.fetchMock).toBeDefined();
		});

		it('should not call getUserRepository.getAuthInfo when CSRF token is invalid', async () => {
			using context = setupAuthenticationTestContext();

			const mockGetAuthInfo = vi.fn();

			vi.mocked(getCookieMock).mockReturnValue({ value: null });
			vi.mocked(getUserRepositoryMock).mockReturnValue({
				getAuthInfo: mockGetAuthInfo,
			});

			const { validateAuthentication } = useAuthentication();

			await validateAuthentication();

			expect(mockGetAuthInfo).not.toHaveBeenCalled();
			expect(context.fetchMock).toBeDefined();
		});
	});

	it('should call signIn with correct parameters', async () => {
		using context = setupAuthenticationTestContext();

		vi.mocked(getCookieMock).mockReturnValue({ value: AUTHENTICATION_TEST_COOKIE });

		const { signIn } = useAuthentication();
		const testEmail = 'test@example.com';
		// eslint-disable-next-line sonarjs/no-hardcoded-passwords
		const testPassword = 'test-password';

		await signIn(testEmail, testPassword);

		expect(context.fetchMock).toHaveBeenCalledTimes(2);

		expect(context.fetchMock).toHaveBeenNthCalledWith(
			1,
			`https://test.server.de/auth/sign-in/auth-systems?email-or-login=${encodeURIComponent(testEmail)}`,
		);

		expect(context.fetchMock).toHaveBeenNthCalledWith(
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
