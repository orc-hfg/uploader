// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: '2025-01-24',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint', '@nuxt/test-utils/module'],
	eslint: {
		config: {

			/*
			 * Ensures the module only generates Nuxt-specific rules so that it can be merged with
			 * own config presets (@antfu/eslint-config)
			 */
			standalone: false,
		},
	},
	typescript: {
		typeCheck: true,
	},
	runtimeConfig: {
		isMainApp: true,
	},
	extends: ['@orc-hfg/madek-api-nuxt-layer'],
});
