import { expect, test } from './fixtures/accessibility';

test.describe('Error page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/de/non-existent-route');
	});

	test('should display error page correctly', async ({ page, makeAxeBuilder }) => {
		await expect(page).toHaveTitle('Fehler – Uploader');
		await expect(page.getByRole('heading', { name: 'Fehler' })).toBeVisible();

		// Verify error messages
		await expect(page.getByText('Es ist ein Fehler aufgetreten.')).toBeVisible();
		await expect(page.getByText('Bitte versuchen Sie es erneut oder kehren Sie zur Projektübersicht zurück.')).toBeVisible();

		// Verify "back to projects" button is visible
		await expect(page.getByRole('button', { name: 'Zur Projektübersicht' })).toBeVisible();

		// Test accessibility of error page
		const results = await makeAxeBuilder().analyze();

		expect(results.violations).toStrictEqual([]);
	});

	// No accessibility check needed – same error page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should navigate back to projects page', async ({ page }) => {
		// Click "back to projects" button
		const backButton = page.getByRole('button', { name: 'Zur Projektübersicht' });

		await backButton.click();

		// Verify redirect to projects page
		await expect(page).toHaveURL('/uploader/de/projekte');
		await expect(page).toHaveTitle('Projekte – Uploader');
	});
});

test.describe('Error page (English locale)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/en/non-existent-route');
	});

	// No accessibility check needed – same error page as German locale test
	// eslint-disable-next-line no-restricted-syntax
	test('should show error page with English locale', async ({ page }) => {
		await expect(page).toHaveTitle('Error – Uploader');
		await expect(page.getByRole('heading', { name: 'Error' })).toBeVisible();

		// Verify English error messages
		await expect(page.getByText('An error occurred.')).toBeVisible();
		await expect(page.getByText('Please try again or return to the project overview.')).toBeVisible();

		// Verify "back to projects" button with English label
		await expect(page.getByRole('button', { name: 'Back to projects' })).toBeVisible();
	});

	// No accessibility check needed – same error page functionality
	// eslint-disable-next-line no-restricted-syntax
	test('should navigate back to projects page', async ({ page }) => {
		const backButton = page.getByRole('button', { name: 'Back to projects' });

		await backButton.click();

		// Verify redirect to English projects page
		await expect(page).toHaveURL('/uploader/en/projects');
		await expect(page).toHaveTitle('Projects – Uploader');
	});
});
