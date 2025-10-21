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
