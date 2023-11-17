import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const config: PlaywrightTestConfig = defineConfig({
	projects: [
		// Setup project
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// Use prepared auth state.
				storageState: 'tests/.auth/user.json'
			},
			dependencies: ['setup']
		}
	],
	webServer: {
		command: 'bun run build && bun run preview',
		stderr: 'pipe',
		stdout: 'pipe',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
});

export default config;
