// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: '2025-01-24',
	devtools: { enabled: true },
	typescript: {
		typeCheck: true,
	},
	css: ['~/assets/css/main.css'],
	modules: [
		'@nuxtjs/google-fonts',
		'@primevue/nuxt-module',
		'@nuxt/eslint',
		'@nuxt/test-utils/module',
	],
	googleFonts: {
		display: 'swap',
		families: {
			// eslint-disable-next-line ts/no-magic-numbers
			'Instrument+Sans': [400],
		},
	},
	primevue: {
		importTheme: { from: '~/theme/theme.ts' },
	},
	eslint: {
		config: {

			/*
			 * Ensures the module only generates Nuxt-specific rules so that it can be merged with
			 * own config presets (@antfu/eslint-config)
			 */
			standalone: false,
		},
	},
	runtimeConfig: {
		isMainApp: true,
	},
	extends: ['@orc-hfg/madek-api-nuxt-layer'],
});
