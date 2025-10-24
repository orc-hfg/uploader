import type { AppLocale } from '@@/app/types/locale';
import type { BrowserContext, Page } from '@playwright/test';
import { AUTHENTICATION_INVALID_USER_LOGIN, AUTHENTICATION_INVALID_USER_PASSWORD, AUTHENTICATION_MOCK_VALID_USER_LOGIN, AUTHENTICATION_MOCK_VALID_USER_PASSWORD } from '@@/shared/constants/test';
import { expect } from '@playwright/test';
import { expectPageLoadedWithHeadingAndTitle } from './page-assertions';

interface SignInLabels {
	emailOrLogin: string;
	password: string;
	submit: string;
}

export async function signInAs(page: Page, user: string, password: string, locale: AppLocale): Promise<void> {
	const content = page.getByTestId('content');

	await expect(content).toBeVisible();

	/*
	 * Wait for layout animation to complete before interacting with form.
	 * The layout has an animation sequence that fades in the content.
	 * Without this wait, input fields are technically editable but not visually ready,
	 * causing form values to not be set correctly.
	 */
	await page.waitForFunction(
		() => {
			const element = document.querySelector('[data-testid="content"]');

			if (!element) {
				return false;
			}

			return globalThis.getComputedStyle(element).opacity === '1';
		},
		{
			timeout: 5000,
		},
	);

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

export async function signOut(page: Page): Promise<void> {
	await page.getByRole('button', { name: 'Abmelden (Test)' }).click();
}

export async function signInAsValidUser(page: Page, locale: AppLocale): Promise<void> {
	await signInAs(page, AUTHENTICATION_MOCK_VALID_USER_LOGIN, AUTHENTICATION_MOCK_VALID_USER_PASSWORD, locale);
}

export async function signInAsInvalidUser(page: Page, locale: AppLocale): Promise<void> {
	await signInAs(page, AUTHENTICATION_INVALID_USER_LOGIN, AUTHENTICATION_INVALID_USER_PASSWORD, locale);
}

export async function expectRedirectToSignIn(page: Page, context: BrowserContext, protectedRoute: string, locale: AppLocale): Promise<void> {
	await context.clearCookies();

	await page.goto(protectedRoute);

	const signInPath = locale === 'de' ? '/uploader/de/anmeldung' : '/uploader/en/sign-in';
	const expectedHeading = locale === 'de' ? 'Anmeldung' : 'Sign In';
	const expectedTitle = locale === 'de' ? 'Anmeldung – Uploader' : 'Sign In – Uploader';

	await expect(page).toHaveURL(signInPath);
	await expectPageLoadedWithHeadingAndTitle(page, expectedHeading, expectedTitle);
}
