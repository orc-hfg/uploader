interface AuthenticationMockUser {
	id: string;
	login: string;
}

export const AUTHENTICATION_MOCK_VALID_USER_LOGIN = 'test';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const AUTHENTICATION_MOCK_VALID_USER_PASSWORD = '123';

export const AUTHENTICATION_MOCK_VALID_USER: AuthenticationMockUser = {
	login: AUTHENTICATION_MOCK_VALID_USER_LOGIN,
	id: 'test-123',
};

export const AUTHENTICATION_MOCK_SESSION_PREFIX = 'mock-session-';
export const AUTHENTICATION_TEST_COOKIE = 'test-cookie=value123';

export const AUTHENTICATION_INVALID_USER_LOGIN = 'invalid';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const AUTHENTICATION_INVALID_USER_PASSWORD = 'user';

export const AUTHENTICATION_SESSION_FILE = '.authentication/session.json';
