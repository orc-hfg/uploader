import { defineVitestProject } from '@nuxt/test-utils/config';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
	return {
		test: {
			projects: [
				await defineVitestProject({
					root: '.',
					test: {
						name: { label: 'unit', color: 'cyan' },
						exclude: ['node_modules', 'tests/e2e/**'],
						include: ['**/*.test.ts'],
					},
				}),
			],
		},
	};
});
