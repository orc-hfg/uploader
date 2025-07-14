export default defineNuxtRouteMiddleware(async (to) => {
	/*
	 * Skip authentication check if we're already on an index page (including localized variants)
	 * This prevents infinite redirects
	 */
	if (to.name.includes('index')) {
		return;
	}

	const authenticationStore = useAuthenticationStore();
	const isUserAuthenticated = authenticationStore.isUserAuthenticated();

	const logger = createLogger();
	logger.debug('Middleware: authentication', 'Checking authentication status.', { isUserAuthenticated });

	const localeRoute = useLocaleRoute();

	if (!isUserAuthenticated) {
		/*
		 * The ESLint 'consistent-return' rule is disabled here because Nuxt middleware supports
		 * special return values. This middleware returns a navigation value when authentication
		 * fails, otherwise it implicitly returns undefined.
		 * This implementation follows the official Nuxt documentation:
		 * https://nuxt.com/docs/guide/directory-structure/middleware
		 */

		// eslint-disable-next-line consistent-return
		return navigateTo(localeRoute('index'));
	}
});
