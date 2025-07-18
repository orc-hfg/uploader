import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';
import { AUTHENTICATION_SESSION_FILE } from './shared/constants/test';

const isCI = Boolean(process.env.CI);

const CI_TEST_RETRIES = 2;

const NUXT_PREVIEW_PORT = 4173;
const NUXT_DEVELOPMENT_PORT = 3000;

const webServerPort = isCI ? NUXT_PREVIEW_PORT : NUXT_DEVELOPMENT_PORT;
const webServerCommand = isCI ? 'npm run preview' : 'npm run dev';

export default defineConfig({
	// Look for test files in the "tests" directory, relative to this configuration file.
	testDir: 'tests',

	// Run all tests in parallel.
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the source code.
	forbidOnly: isCI,

	// Retry on CI only.
	retries: isCI ? CI_TEST_RETRIES : 0,

	// Opt out of parallel tests on CI.
	workers: isCI ? 1 : undefined,

	// Reporter to use
	reporter: 'html',

	use: {
		// Base URL to use in actions like `await page.goto('/')`.
		baseURL: `http://localhost:${webServerPort}`,

		// Collect trace when retrying the failed test.
		trace: 'on-first-retry',
		launchOptions: {
			slowMo: process.env.SLOWMO !== undefined && process.env.SLOWMO !== '' ? Number(process.env.SLOWMO) : undefined,
		},
	},

	// Configure projects for major browsers.
	projects: [
		/*
		 * Speedup tests by reusing the authentication session:
		 * https://www.checklyhq.com/blog/speed-up-playwright-tests-with-storage-state/
		 */
		{
			// Only test the login page
			name: 'login-page',
			use: { ...devices['Desktop Chrome'] },
			testMatch: 'index.test.ts',
		},
		{
			// Test valid login and then create the authentication session file
			name: 'authentication-setup',
			use: { ...devices['Desktop Chrome'] },
			testMatch: '**/*.setup.ts',
		},
		{
			// Only test pages that require authentication (ignores login page)
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

	// Run your local dev server before starting the tests.
	webServer: {
		command: webServerCommand,

		// Use health endpoint that bypasses i18n redirects and always returns 200 OK
		url: `http://localhost:${webServerPort}/health`,
		reuseExistingServer: !isCI,
		timeout: 120_000,
		stdout: 'pipe',
		stderr: 'pipe',
	},
});
