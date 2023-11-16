import { test } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

test('authenticate', async ({ page }) => {
	await page.goto('/auth/signin');
	await page.getByRole('button', { name: 'Sign in with Keycloak' }).click();
	await page.getByLabel('Username').fill('admin');
	await page.getByLabel('Password').fill('admin');
	await page.getByRole('button', { name: 'Sign In' }).click();

	await page.waitForURL('/');

	await page.context().storageState({ path: authFile });
});
