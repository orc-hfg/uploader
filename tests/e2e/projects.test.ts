import { expect, test } from './fixtures/accessibility';

test.describe('Projects page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/de/projekte');
	});

	test('should show projects page correctly', async ({ page, makeAxeBuilder }) => {
		await expect(page).toHaveTitle('Projekte – Uploader');
		await expect(page.getByRole('heading', { name: 'Projekte' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Neues Projekt' })).toBeVisible();

		// Test accessibility of projects page
		const results = await makeAxeBuilder().analyze();

		expect(results.violations).toStrictEqual([]);
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should display projects with images correctly', async ({ page }) => {
		const project1 = 'Test collectionId collection-id-1 / metaKeyId madek_core:title Content';
		const project3 = 'Test collectionId collection-id-3 / metaKeyId madek_core:title Content';

		await expect(page.getByRole('heading', { name: project1 })).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project1 }).getByRole('img')).toBeVisible();

		await expect(page.getByRole('heading', { name: project3 })).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project3 }).getByRole('img')).toBeVisible();
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should show fallback message when project has no image', async ({ page }) => {
		const project2 = 'Test collectionId collection-id-2 / metaKeyId madek_core:title Content';

		await expect(page.getByRole('heading', { name: project2 })).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project2 }).getByText('Bild nicht verfügbar')).toBeVisible();
	});
});

test.describe('Projects page (English locale)', () => {
	// No accessibility check needed – tests different API data, not different UI
	// eslint-disable-next-line no-restricted-syntax
	test('should load different project titles for English locale', async ({ page }) => {
		await page.goto('/uploader/en/projects');

		/*
		 * Verify that different project data is loaded (different metaKeyIds)
		 * These should be different from the German titles due to locale-specific API queries
		 */
		const project1 = 'Test collectionId collection-id-1 / metaKeyId creative_work:title_en Content';

		await expect(page.getByRole('listitem').filter({ hasText: project1 }).getByRole('img')).toBeVisible();
	});
});
