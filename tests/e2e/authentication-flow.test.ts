import { expect, type Page, test } from '@playwright/test';

const TEST_USER = {
	login: 'test',
	password: '123',
};

async function loginAs(page: Page, login: string, password: string) {
	await page.getByLabel('E-Mail-Adresse oder Login').fill(login);
	await page.getByLabel('Passwort').fill(password);

	await page.getByRole('button', { name: 'Anmelden' }).click();
}

test.describe('Authentication Flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/de/anmeldung');

		const content = page.getByTestId('content');

		await expect(content).toBeVisible();
		await expect(content).toHaveCSS('opacity', '1');
	});

	test('should show login page correctly', async ({ page }) => {
		const loginInput = page.getByLabel('E-Mail-Adresse oder Login');
		const passwordInput = page.getByLabel('Passwort');

		await expect(loginInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Anmeldung' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Anmelden' })).toBeVisible();
	});

	test('should login successfully with valid credentials', async ({ page }) => {
		await loginAs(page, TEST_USER.login, TEST_USER.password);

		await expect(page).toHaveURL('/de/projekte');
		await expect(page).not.toHaveTitle('Anmeldung – Uploader');
		await expect(page).toHaveTitle('Projekte – Uploader');
	});

	test('should show error with invalid credentials', async ({ page }) => {
		await loginAs(page, TEST_USER.login, 'falschesPasswort');

		const errorMessage = page.getByTestId('login-error');

		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText('Die Anmeldedaten sind ungültig.');
		await expect(errorMessage).toHaveClass(/p-message-error/u);

		await expect(page).toHaveTitle('Anmeldung – Uploader');
	});

	test('should redirect to login when accessing protected route', async ({ page, context }) => {
		await context.clearCookies();

		await page.goto('/de/projekte');

		await expect(page).toHaveTitle('Anmeldung – Uploader');
	});
});
