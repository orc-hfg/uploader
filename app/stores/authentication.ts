export const useAuthenticationStore = defineStore('authentication', () => {
	const isLoggedIn = ref(false);
	const hasJustLoggedIn = ref(false);

	function isUserAuthenticated(): boolean {
		const logger = createLogger();
		logger.debug('Store: authentication', 'Checking authentication status.', { hasJustLoggedIn: hasJustLoggedIn.value });

		/*
		 * Security & UX compromise: This flag allows the first navigation after login to succeed
		 * even if authentication cookies aren't fully set yet. This solves the problem where
		 * users get redirected back to login immediately after successful authentication.
		 *
		 * NOTE: This is specifically for navigation immediately after login. Critical API
		 * endpoints independently verify authentication server-side regardless of this flag.
		 * The flag is automatically reset after a single use for additional security.
		 */
		if (hasJustLoggedIn.value) {
			hasJustLoggedIn.value = false;

			return true;
		}

		// Otherwise check authentication cookies
		const { hasValidCookies } = useAuthentication();
		isLoggedIn.value = hasValidCookies();

		logger.debug('Store: authentication', 'Authentication status checked.', { isLoggedIn: isLoggedIn.value });

		return isLoggedIn.value;
	}

	return {
		isLoggedIn,
		hasJustLoggedIn,
		isUserAuthenticated,
	};
});
