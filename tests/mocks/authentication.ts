import { TEST_COOKIE } from '@@/shared/constants/test';
import { vi } from 'vitest';

interface RuntimeConfigMock {
	public: {
		serverUrl: string;
		appPathName: string;
		authentication: {
			basePath: string;
			signInPathName: string;
			systemPathName: string;
			systemPath: string;
			defaultSystemName: string;
			emailOrLoginParameter: string;
			returnToParameter: string;
			csrfCookieName: string;
			csrfHeaderName: string;
			sessionCookieName: string;
		};
	};
}

export function getRuntimeConfigMock(): RuntimeConfigMock {
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

export function getCookieMock(): { value: string } {
	return {
		value: TEST_COOKIE,
	};
}

export function getUserRepositoryMock(): { getAuthInfo: ReturnType<typeof vi.fn> } {
	return {
		getAuthInfo: vi.fn().mockResolvedValue({}),
	};
}
