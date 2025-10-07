/*
 * Authentication middleware that protects routes from unauthenticated access.
 *
 * This middleware runs on both server and client to ensure consistent authentication
 * checking and prevent unauthorized content from briefly appearing.
 *
 * Trade-offs:
 * - During initial page load, the auth-info API endpoint is called twice (once during SSR, once on client)
 * - This double-call only happens on full page reload, not during SPA navigation
 *
 * The minor performance impact of an extra API call during initial load is worth the benefits of
 * simplicity and security.
 *
 * Note: Route middleware only runs for page routes, not server routes (API endpoints, etc.).
 * Server routes are handled by Nitro and should implement their own authentication if needed.
 *
 * See: https://nuxt.com/docs/guide/directory-structure/middleware#when-middleware-runs
 */
export default defineNuxtRouteMiddleware(async (to) => {
	/*
	 * Skip authentication check for the index page and pages that explicitly disable authentication
	 * This prevents infinite redirects and respects page-level auth configuration
	 */
	const isIndexPage = typeof to.name === 'string' && to.name.includes('index');
	const isAuthenticationSkipped = to.meta.skipAuthentication === true;

	if (isIndexPage || isAuthenticationSkipped) {
		return;
	}

	const isAuthenticationValid = await useAuthentication().validateAuthentication();

	const localeRoute = useLocaleRoute();

	if (!isAuthenticationValid) {
		/*
		 * ESLint 'consistent-return' rule disabled: Nuxt middleware uses return values for flow control.
		 *
		 * How Nuxt middleware return values work:
		 * - Return navigateTo(): Redirects user and stops further processing
		 * - Return nothing (undefined): Continues normal page loading
		 *
		 * This mixed return pattern is intentional and documented by Nuxt:
		 * https://nuxt.com/docs/guide/directory-structure/middleware
		 */

		// eslint-disable-next-line consistent-return
		return navigateTo(localeRoute('index'));
	}
});
