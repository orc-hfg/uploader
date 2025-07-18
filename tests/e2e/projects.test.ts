import { expect, test } from '@playwright/test';

test.describe('Projects page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/de/projekte');
	});

	test('should show projects page correctly', async ({ page }) => {
		await expect(page).toHaveTitle('Projekte – Uploader');

		await expect(page.getByRole('heading', { name: 'Projekte' })).toBeVisible();
	});
});
