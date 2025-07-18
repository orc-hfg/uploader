/**
 * Health check endpoint for server readiness verification
 * Always returns 200 OK regardless of i18n redirects or authentication state
 *
 * Primary use cases:
 * - CI/CD pipelines (Playwright webServer readiness check)
 * - Monitoring systems
 * - Load balancer health checks
 */

export default defineEventHandler((event) => {
	setResponseHeader(event, 'Cache-Control', 'no-store');

	return {
		status: 'healthy',
		service: 'uploader',
		timestamp: new Date().toISOString(),
	};
});
