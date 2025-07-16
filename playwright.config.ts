import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

const CI_TEST_RETRIES = 2;
const isCI = typeof process.env.CI === 'string' && process.env.CI !== '';

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
		baseURL: 'http://localhost:3000',

		// Collect trace when retrying the failed test.
		trace: 'on-first-retry',
	},

	// Configure projects for major browsers.
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
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
		command: 'npm run dev',
		url: 'http://localhost:3000',
		reuseExistingServer: !isCI,
	},
});
