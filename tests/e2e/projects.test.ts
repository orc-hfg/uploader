import { expect, test } from './fixtures/accessibility';
import { expectRedirectToSignIn } from './helpers/authentication';
import { expectPageLoadedWithHeadingAndTitle } from './helpers/page-assertions';

test.describe('Projects page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/de/projekte');
	});

	test('should show projects page correctly', async ({ page, makeAxeBuilder }) => {
		await expectPageLoadedWithHeadingAndTitle(page, 'Projekte', 'Projekte – Uploader');

		await expect(page.getByRole('button', { name: 'Neues Projekt' })).toBeVisible();

		const results = await makeAxeBuilder().analyze();

		expect(results.violations).toStrictEqual([]);
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should require authentication to access projects page', async ({ page, context }) => {
		await expectRedirectToSignIn(page, context, '/uploader/de/projekte', 'de');
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should display projects with images correctly', async ({ page }) => {
		const project1 = 'Test collectionId collection-id-1 / metaKeyId madek_core:title Content';
		const project3 = 'Test collectionId collection-id-3 / metaKeyId madek_core:title Content';

		await expect(page.getByRole('heading', { name: project1 })).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project1 }).getByRole('img')).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project1 }).getByRole('link', { name: 'Öffnen' })).toBeVisible();

		await expect(page.getByRole('heading', { name: project3 })).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project3 }).getByRole('img')).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project3 }).getByRole('link', { name: 'Öffnen' })).toBeVisible();
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should show fallback message when project has no image', async ({ page }) => {
		const project2 = 'Test collectionId collection-id-2 / metaKeyId madek_core:title Content';

		await expect(page.getByRole('heading', { name: project2 })).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project2 }).getByText('Bild nicht verfügbar')).toBeVisible();
		await expect(page.getByRole('listitem').filter({ hasText: project2 }).getByRole('link', { name: 'Öffnen' })).toBeVisible();
	});

	test('should show empty state message when no projects exist', async ({ page, makeAxeBuilder }) => {
		await page.goto('/uploader/de/projekte?mock_scenario=empty');

		await expectPageLoadedWithHeadingAndTitle(page, 'Projekte', 'Projekte – Uploader');

		await expect(page.getByText('Noch keine Projekte vorhanden.')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Neues Projekt' })).toBeVisible();
		await expect(page.getByRole('listitem')).not.toBeVisible();

		const results = await makeAxeBuilder().analyze();

		expect(results.violations).toStrictEqual([]);
	});
});

test.describe('Projects page (English locale)', () => {
	/*
	 * Smoke test for English locale
	 * Business logic and edge cases (empty state, fallback messages) are tested in German locale
	 * This test only verifies that routing and translations work correctly
	 */
	// No accessibility check needed – same projects page as German locale test
	// eslint-disable-next-line no-restricted-syntax
	test('should show projects with English translations and routing', async ({ page }) => {
		await page.goto('/uploader/en/projects');

		await expectPageLoadedWithHeadingAndTitle(page, 'Projects', 'Projects – Uploader');

		const project1 = 'Test collectionId collection-id-1 / metaKeyId creative_work:title_en Content';

		await expect(page.getByRole('listitem').filter({ hasText: project1 }).getByRole('img')).toBeVisible();
		await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
	});
});
