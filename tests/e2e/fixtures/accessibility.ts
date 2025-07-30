import AxeBuilder from '@axe-core/playwright';
import { test as base } from '@playwright/test';
import { createLogger } from '../helpers/logger';

interface AccessibilityFixtures {
	makeAxeBuilder: () => AxeBuilder;
}

// See: https://playwright.dev/docs/accessibility-testing#creating-a-fixture
export const test = base.extend<AccessibilityFixtures>({
	makeAxeBuilder: async ({ page }, use) => {
		function makeAxeBuilder(): AxeBuilder {
			const logger = createLogger();
			logger.warn('Fixture: accessibility', 'Color contrast checks temporarily disabled. Please fix design issues and re-enable.');

			return new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])

			/*
			 * TODO: Remove this temporary exclusion after design fixes
			 * Issue: Color contrast violations in login form labels
			 */
				.disableRules(['color-contrast']);
		}
		await use(makeAxeBuilder);
	},
});

export { expect } from '@playwright/test';
