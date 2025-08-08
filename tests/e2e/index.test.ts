import { expect, test } from './fixtures/accessibility';
import { signInAsInvalidUser, signInAsValidUser } from './helpers/authentication';

test.describe('Authentication flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/de/anmeldung');
	});

	test('should show sign-in page correctly', async ({ page, makeAxeBuilder }) => {
		const loginInput = page.getByLabel('E-Mail-Adresse oder Login');
		const passwordInput = page.getByLabel('Passwort');

		await expect(loginInput).toBeVisible();
		await expect(passwordInput).toBeVisible();

		await expect(page).toHaveTitle('Anmeldung – Uploader');
		await expect(page.getByRole('heading', { name: 'Anmeldung' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Anmelden' })).toBeVisible();

		// Test accessibility of sign-in page (only once)
		const results = await makeAxeBuilder().analyze();

		expect(results.violations).toStrictEqual([]);
	});

	test('should sign in successfully with valid credentials', async ({ page, makeAxeBuilder }) => {
		await signInAsValidUser(page);

		await expect(page).toHaveURL('/uploader/de/projekte');
		await expect(page).toHaveTitle('Projekte – Uploader');

		// Test accessibility of projects page (different page)
		const projectsPageResults = await makeAxeBuilder().analyze();

		expect(projectsPageResults.violations).toStrictEqual([]);
	});

	test('should show error with invalid credentials', async ({ page, makeAxeBuilder }) => {
		await signInAsInvalidUser(page);

		const errorMessage = page.getByTestId('sign-in-error');

		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText('Die Anmeldedaten sind ungültig.');
		await expect(errorMessage).toHaveClass(/p-message-error/u);

		// Test accessibility with error message (different state)
		const errorPageResults = await makeAxeBuilder().analyze();

		expect(errorPageResults.violations).toStrictEqual([]);
	});

	test('should redirect to sign-in page when accessing protected route', async ({ page, context }) => {
		await context.clearCookies();

		await page.goto('/uploader/de/projekte');

		await expect(page).toHaveURL('/uploader/de/anmeldung');
		await expect(page).toHaveTitle('Anmeldung – Uploader');

		// No accessibility check needed - same sign-in page as first test
	});
});
