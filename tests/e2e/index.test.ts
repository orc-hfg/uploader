import { expect, test } from './fixtures/accessibility';
import { expectRedirectToSignIn, signInAsInvalidUser, signInAsValidUser } from './helpers/authentication';
import { expectPageLoadedWithHeadingAndTitle } from './helpers/page-assertions';

test.describe('Authentication flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/de/anmeldung');
	});

	test('should show sign-in page correctly', async ({ page, makeAxeBuilder }) => {
		await expectPageLoadedWithHeadingAndTitle(page, 'Anmeldung', 'Anmeldung – Uploader');

		await expect(page.getByRole('button', { name: 'Anmelden' })).toBeVisible();

		const loginInput = page.getByLabel('E-Mail-Adresse oder Login');
		const passwordInput = page.getByLabel('Passwort');

		await expect(loginInput).toBeVisible();
		await expect(passwordInput).toBeVisible();

		/*
		 * Exclude password field due to PrimeVue accessibility bug (aria-allowed-attr violation)
		 * PrimeVue incorrectly adds aria-expanded and aria-haspopup to password inputs
		 * TODO: Remove this exclusion after PrimeVue updates - check if fixed in new versions
		 * Related issues: https://github.com/primefaces/primevue/issues/8210
		 */
		const results = await makeAxeBuilder()
			.exclude('#password_label')
			.analyze();

		expect(results.violations).toStrictEqual([]);
	});

	// No accessibility check needed – testing authentication, not projects page
	// eslint-disable-next-line no-restricted-syntax
	test('should sign in successfully with valid credentials', async ({ page }) => {
		await signInAsValidUser(page, 'de');

		// Verify successful redirect to projects page
		await expect(page).toHaveURL('/uploader/de/projekte');

		await expectPageLoadedWithHeadingAndTitle(page, 'Projekte', 'Projekte – Uploader');
	});

	test('should show error with invalid credentials', async ({ page, makeAxeBuilder }) => {
		await signInAsInvalidUser(page, 'de');

		const errorMessage = page.getByTestId('sign-in-error');

		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText('Die Anmeldedaten sind ungültig.');
		await expect(errorMessage).toHaveAttribute('role', 'alert');

		/*
		 * Test accessibility with error message (different state)
		 * Exclude password field due to PrimeVue accessibility bug (aria-allowed-attr violation)
		 * PrimeVue incorrectly adds aria-expanded and aria-haspopup to password inputs
		 * TODO: Remove this exclusion after PrimeVue updates - check if fixed in new versions
		 * Related issues: https://github.com/primefaces/primevue/issues/8210
		 */
		const errorPageResults = await makeAxeBuilder()
			.exclude('#password_label')
			.analyze();

		expect(errorPageResults.violations).toStrictEqual([]);
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should redirect to sign-in page when accessing a protected page route', async ({ page, context }) => {
		await expectRedirectToSignIn(page, context, '/uploader/de/projekte', 'de');
	});
});

test.describe('Authentication flow (English locale)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/en/sign-in');
	});

	// No accessibility check needed – same sign-in page as German locale test
	// eslint-disable-next-line no-restricted-syntax
	test('should show sign-in page with English locale', async ({ page }) => {
		await expectPageLoadedWithHeadingAndTitle(page, 'Sign-in', 'Sign-in – Uploader');

		await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

		const loginInput = page.getByLabel('Email or login');
		const passwordInput = page.getByLabel('Password');

		await expect(loginInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
	});

	// No accessibility check needed – same error state
	// eslint-disable-next-line no-restricted-syntax
	test('should show error with invalid credentials in English', async ({ page }) => {
		await signInAsInvalidUser(page, 'en');

		const errorMessage = page.getByTestId('sign-in-error');

		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).toHaveText('Invalid credentials.');
		await expect(errorMessage).toHaveAttribute('role', 'alert');
	});
});
