import type { Locator, Page } from '@playwright/test';

/*
 * Helper to locate PrimeVue Chip components by label content
 * Matches the ChipItem interface from LabeledChipList component
 * Supports both simple chips and chips with secondary labels
 * Use with standard Playwright assertions in your tests
 *
 * Parameter order groups ChipItem properties (label, secondaryLabel) together:
 * - getChip(page, 'label') - Find chip globally
 * - getChip(page, 'label', undefined, container) - Find chip within container
 * - getChip(page, 'label', 'secondary') - Find chip with secondary label globally
 * - getChip(page, 'label', 'secondary', container) - Find chip with secondary label in container
 */
export function getChip(page: Page, label: string, secondaryLabel?: string, within?: Locator): Locator {
	const context = within ?? page;

	// eslint-disable-next-line playwright/no-raw-locators
	let chip = context.locator('[data-pc-name="chip"]').filter({ hasText: label });

	if (secondaryLabel !== undefined) {
		// Ensure both label AND secondaryLabel are in the SAME chip
		chip = chip.filter({ hasText: secondaryLabel });
	}

	return chip;
}
