import { INVALID_USER_LOGIN, INVALID_USER_PASSWORD, VALID_USER_LOGIN, VALID_USER_PASSWORD } from '@@/shared/constants/test';
import { expect, type Page } from '@playwright/test';

export async function loginAs(page: Page, login: string, password: string): Promise<void> {
	const content = page.getByTestId('content');

	await expect(content).toBeVisible();
	await expect(content).toHaveCSS('opacity', '1');

	await page.getByLabel('E-Mail-Adresse oder Login').fill(login);
	await page.getByLabel('Passwort').fill(password);

	await page.getByRole('button', { name: 'Anmelden' }).click();
}

export async function loginAsValidUser(page: Page): Promise<void> {
	await loginAs(page, VALID_USER_LOGIN, VALID_USER_PASSWORD);
}

export async function loginAsInvalidUser(page: Page): Promise<void> {
	await loginAs(page, INVALID_USER_LOGIN, INVALID_USER_PASSWORD);
}
