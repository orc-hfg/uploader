import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';
import { AUTHENTICATION_SESSION_FILE } from './shared/constants/test';

const isCIEnvironment = process.env.CI === 'true';
const isPlaywrightLoggingEnabled = process.env.ENABLE_PLAYWRIGHT_LOGGING === 'true';
const isPlaywrightPreviewServerEnabled = process.env.ENABLE_PLAYWRIGHT_PREVIEW_SERVER === 'true';
const slowMoValue = process.env.SLOWMO !== undefined && process.env.SLOWMO !== '' ? Number(process.env.SLOWMO) : undefined;

// Maximum number of retries for CI environment to handle network instabilities
const CI_MAX_RETRIES = 3;
const LOCAL_MAX_RETRIES = 0;

// Generally increase number of retries to handle sporadic EPIPE errors
const MAX_RETRIES = isCIEnvironment ? CI_MAX_RETRIES : LOCAL_MAX_RETRIES;

export default defineConfig({
	// Look for test files in the "tests" directory, relative to this configuration file.
	testDir: 'tests',

	// Run all tests in parallel.
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the source code.
	forbidOnly: isCIEnvironment,

	retries: MAX_RETRIES,

	workers: isCIEnvironment ? 1 : undefined,

	expect: {
		timeout: 10_000,
	},

	reporter: 'html',

	use: {
		/*
		 * Base URL to use in actions like `await page.goto('/')`.
		 *
		 * NOTE: Set to 'http://localhost:3000' instead of 'http://localhost:3000/uploader'
		 * for consistency between page.goto() and expect(page).toHaveURL() calls.
		 *
		 * Why this decision was made:
		 * - page.goto('/uploader/path') and expect(page).toHaveURL('/uploader/path') use the same schema
		 * - Avoids confusion where goto() uses relative paths but toHaveURL() needs full URLs
		 * - More explicit and predictable: what you write is what you get
		 * - Easier maintenance: no mixed relative/absolute path handling
		 */
		baseURL: 'http://localhost:3000',

		// Collect trace when retrying the failed test.
		trace: 'on-first-retry',
		launchOptions: {
			slowMo: slowMoValue,
		},
	},

	// Configure projects for major browsers.
	projects: [
		/*
		 * Speedup tests by reusing the authentication session:
		 * https://www.checklyhq.com/blog/speed-up-playwright-tests-with-storage-state/
		 */
		{
			// Only test the sign-in page
			name: 'sign-in-page',
			use: { ...devices['Desktop Chrome'] },
			testMatch: 'index.test.ts',
		},
		{
			// Test valid sign-in and then create the authentication session file
			name: 'authentication-setup',
			use: { ...devices['Desktop Chrome'] },
			testMatch: '**/*.setup.ts',
		},
		{
			// Only test pages that require authentication (ignores sign-in page)
			name: 'authenticated-pages',
			use: {
				...devices['Desktop Chrome'],
				storageState: AUTHENTICATION_SESSION_FILE,
			},
			testIgnore: 'index.test.ts',
			dependencies: ['authentication-setup'],
		},

		/*
		 * {
		 * 	name: 'firefox',
		 * 	use: { ...devices['Desktop Firefox'] },
		 * },
		 * {
		 * 	name: 'safari',
		 * 	use: { ...devices['Desktop Safari'] },
		 * },
		 * {
		 * 	name: 'iphone',
		 * 	use: { ...devices['iPhone 15 Pro'] },
		 * },
		 */
	],
	webServer: {
		/*
		 * Server commands for different environments:
		 * - CI uses preview server (production-like build for testing)
		 * - Local uses dev server (fast development)
		 */
		command: isCIEnvironment || isPlaywrightPreviewServerEnabled ? 'npm run preview' : 'npm run dev:api-mock',

		/*
		 * Health endpoint for Playwright webServer readiness check
		 * Bypasses authentication and i18n redirects, ensuring reliable server startup detection
		 */
		url: 'http://localhost:3000/health',
		reuseExistingServer: false,

		/*
		 * Pipe server output to test logs for debugging CI and local issues
		 * Allows viewing build process, startup logs, and error details
		 */
		...(isCIEnvironment || isPlaywrightLoggingEnabled ? {
			stdout: 'pipe',
			stderr: 'pipe',
		} : {}),
	},
});
