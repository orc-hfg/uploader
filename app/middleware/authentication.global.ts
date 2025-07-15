/*
 * Authentication middleware that protects routes from unauthenticated access.
 *
 * NOTE ON EXECUTION CONTEXT:
 * This middleware executes in both server and client contexts. We considered limiting it to
 * client-side only with `if (import.meta.server) return`, but decided against it for these reasons:
 *
 * Benefits of running in both contexts:
 * 1. Better security: No "flash of unauthorized content" during initial page load
 * 2. Consistent behavior: Authentication is always checked the same way
 * 3. Simpler code: No special cases or complex context-specific logic
 *
 * Trade-offs:
 * - During initial page load, the auth-info API endpoint is called twice (once during SSR, once on client)
 * - This double-call only happens on full page reload, not during SPA navigation
 *
 * The minor performance impact of an extra API call during initial load is worth the benefits of
 * simplicity and security.
 *
 * See: https://nuxt.com/docs/guide/directory-structure/middleware#when-middleware-runs
 */
export default defineNuxtRouteMiddleware(async (to) => {
	/*
	 * Skip authentication check if we're already on an index page (including localized variants)
	 * This prevents infinite redirects
	 */
	if (to.name.includes('index')) {
		return;
	}

	const isAuthenticationValid = await useAuthentication().validateAuthentication();

	const localeRoute = useLocaleRoute();

	if (!isAuthenticationValid) {
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
