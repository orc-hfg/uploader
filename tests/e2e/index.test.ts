import { expect, test } from '@playwright/test';
import { loginAsInvalidUser, loginAsValidUser } from './helpers/authentication';

test.describe('Authentication flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/de/anmeldung');
	});

	test('should show login page correctly', async ({ page }) => {
		const loginInput = page.getByLabel('E-Mail-Adresse oder Login');
		const passwordInput = page.getByLabel('Passwort');

		await expect(loginInput).toBeVisible();
		await expect(passwordInput).toBeVisible();

		await expect(page).toHaveTitle('Anmeldung – Uploader');
		await expect(page.getByRole('heading', { name: 'Anmeldung' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Anmelden' })).toBeVisible();
	});

	test('should login successfully with valid credentials', async ({ page }) => {
		await loginAsValidUser(page);

		await expect(page).toHaveURL('/uploader/de/projekte');
		await expect(page).toHaveTitle('Projekte – Uploader');
	});

	test('should show error with invalid credentials', async ({ page }) => {
		await loginAsInvalidUser(page);

		const errorMessage = page.getByTestId('login-error');

		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText('Die Anmeldedaten sind ungültig.');
		await expect(errorMessage).toHaveClass(/p-message-error/u);

		await expect(page).toHaveTitle('Anmeldung – Uploader');
	});

	test('should redirect to login when accessing protected route', async ({ page, context }) => {
		await context.clearCookies();

		await page.goto('/uploader/de/projekte');

		await expect(page).toHaveTitle('Anmeldung – Uploader');
	});
});
