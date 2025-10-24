import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/*
 * Helper to assert page is fully loaded
 * Waits for heading first (proves data is loaded), then checks document title
 * This prevents race conditions in dev server where title might be set asynchronously
 */
export async function expectPageLoadedWithHeadingAndTitle(page: Page, expectedHeading: string, expectedTitle: string): Promise<void> {
	await expect(page.getByRole('heading', { name: expectedHeading })).toBeVisible();
	await expect(page).toHaveTitle(expectedTitle);
}
