interface AuthenticationMockUser {
	id: string;
	login: string;
	first_name: string;
	last_name: string;
}

export const AUTHENTICATION_MOCK_VALID_USER_LOGIN = 'test';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const AUTHENTICATION_MOCK_VALID_USER_PASSWORD = '123';

export const AUTHENTICATION_MOCK_VALID_USER: AuthenticationMockUser = {
	id: 'test-123',
	login: AUTHENTICATION_MOCK_VALID_USER_LOGIN,
	first_name: 'first_name',
	last_name: 'last_name',
};

export const AUTHENTICATION_MOCK_SESSION_PREFIX = 'mock-session-';
export const AUTHENTICATION_TEST_COOKIE = 'test-cookie=value123';

export const AUTHENTICATION_INVALID_USER_LOGIN = 'invalid';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const AUTHENTICATION_INVALID_USER_PASSWORD = 'user';

export const AUTHENTICATION_SESSION_FILE = '.authentication/session.json';
