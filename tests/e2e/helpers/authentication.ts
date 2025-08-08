import type { Page } from '@playwright/test';
import { AUTHENTICATION_INVALID_USER_LOGIN, AUTHENTICATION_INVALID_USER_PASSWORD, AUTHENTICATION_MOCK_VALID_USER_LOGIN, AUTHENTICATION_MOCK_VALID_USER_PASSWORD } from '@@/shared/constants/test';
import { expect } from '@playwright/test';

export async function signInAs(page: Page, user: string, password: string): Promise<void> {
	const content = page.getByTestId('content');

	await expect(content).toBeVisible();
	await expect(content).toHaveCSS('opacity', '1');

	await page.getByLabel('E-Mail-Adresse oder Login').fill(user);
	await page.getByLabel('Passwort').fill(password);

	await page.getByRole('button', { name: 'Anmelden' }).click();
}

export async function signInAsValidUser(page: Page): Promise<void> {
	await signInAs(page, AUTHENTICATION_MOCK_VALID_USER_LOGIN, AUTHENTICATION_MOCK_VALID_USER_PASSWORD);
}

export async function signInAsInvalidUser(page: Page): Promise<void> {
	await signInAs(page, AUTHENTICATION_INVALID_USER_LOGIN, AUTHENTICATION_INVALID_USER_PASSWORD);
}
