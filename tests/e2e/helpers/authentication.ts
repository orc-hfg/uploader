import type { AppLocale } from '@@/app/types/locale';
import type { Page } from '@playwright/test';
import { AUTHENTICATION_INVALID_USER_LOGIN, AUTHENTICATION_INVALID_USER_PASSWORD, AUTHENTICATION_MOCK_VALID_USER_LOGIN, AUTHENTICATION_MOCK_VALID_USER_PASSWORD } from '@@/shared/constants/test';
import { expect } from '@playwright/test';

interface SignInLabels {
	emailOrLogin: string;
	password: string;
	submit: string;
}

export async function signInAs(page: Page, user: string, password: string, locale: AppLocale): Promise<void> {
	const content = page.getByTestId('content');

	await expect(content).toBeVisible();
	await expect(content).toHaveCSS('opacity', '1');

	const labels: Record<AppLocale, SignInLabels> = {
		de: {
			emailOrLogin: 'E-Mail-Adresse oder Login',
			// eslint-disable-next-line sonarjs/no-hardcoded-passwords
			password: 'Passwort',
			submit: 'Anmelden',
		},
		en: {
			emailOrLogin: 'Email or login',
			// eslint-disable-next-line sonarjs/no-hardcoded-passwords
			password: 'Password',
			submit: 'Sign in',
		},
	};

	await page.getByLabel(labels[locale].emailOrLogin).fill(user);
	await page.getByLabel(labels[locale].password).fill(password);

	await page.getByRole('button', { name: labels[locale].submit }).click();
}

export async function signInAsValidUser(page: Page, locale: AppLocale): Promise<void> {
	await signInAs(page, AUTHENTICATION_MOCK_VALID_USER_LOGIN, AUTHENTICATION_MOCK_VALID_USER_PASSWORD, locale);
}

export async function signInAsInvalidUser(page: Page, locale: AppLocale): Promise<void> {
	await signInAs(page, AUTHENTICATION_INVALID_USER_LOGIN, AUTHENTICATION_INVALID_USER_PASSWORD, locale);
}
