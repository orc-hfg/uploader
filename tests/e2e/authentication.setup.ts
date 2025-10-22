/*
 * Authentication Setup for Playwright Tests
 *
 * PURPOSE:
 * This setup file creates a reusable authentication session that can be shared
 * across multiple test files. Instead of signing in before every test, we sign in
 * once and save the session state to a file.
 *
 * HOW IT WORKS:
 * 1. This setup runs as a separate Playwright project ("authentication-setup")
 * 2. It performs a real sign-in flow and waits for successful redirect
 * 3. The authenticated session (cookies, storage) is saved to AUTHENTICATION_SESSION_FILE
 * 4. Other tests load this file via storageState in playwright.config.ts
 * 5. Those tests start already authenticated, skipping the sign-in process
 *
 * TEST PROJECT ARCHITECTURE:
 * See playwright.config.ts for the three-project setup:
 * 1. "sign-in-page": Tests the sign-in functionality itself
 * 2. "authentication-setup": This file - creates the session
 * 3. "authenticated-pages": All tests that require authentication
 *
 * REFERENCES:
 * - Blog post: https://www.checklyhq.com/blog/speed-up-playwright-tests-with-storage-state/
 * - Playwright Storage State: https://playwright.dev/docs/auth#reuse-signed-in-state
 */

import { AUTHENTICATION_SESSION_FILE } from '@@/shared/constants/test';
import { expect, test as setup } from '@playwright/test';
import { signInAsValidUser } from './helpers/authentication';

// eslint-disable-next-line playwright/require-top-level-describe
setup('authentication', async ({ page }) => {
	await page.goto('/uploader/de/anmeldung');

	await signInAsValidUser(page, 'de');

	// Wait for successful sign-in redirect
	await expect(page).toHaveURL('/uploader/de/projekte');

	await page.context().storageState({ path: AUTHENTICATION_SESSION_FILE });
});
