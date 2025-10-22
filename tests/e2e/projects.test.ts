import { expect, test } from './fixtures/accessibility';
import { expectPageHeadingAndTitle, expectRedirectToSignIn } from './helpers/authentication';

test.describe('Projects page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/de/projekte');
	});

	test('should show projects page correctly', async ({ page, makeAxeBuilder }) => {
		await expectPageHeadingAndTitle(page, 'Projekte', 'Projekte – Uploader');

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
});

test.describe('Projects page (English locale)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uploader/en/projects');
	});

	// No accessibility check needed – same projects page as first test
	// eslint-disable-next-line no-restricted-syntax
	test('should show projects list with English locale', async ({ page }) => {
		const project1 = 'Test collectionId collection-id-1 / metaKeyId creative_work:title_en Content';

		await expect(page.getByRole('listitem').filter({ hasText: project1 }).getByRole('img')).toBeVisible();
	});
});
