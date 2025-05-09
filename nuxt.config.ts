import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: '2025-05-09',
	devtools: { enabled: true },
	typescript: {
		typeCheck: true,
	},
	css: ['@/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss()],
	},
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
		importTheme: { from: '@/theme/primevue.ts' },
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
	app: {
		head: {
			title: 'Uploader',
			htmlAttrs: {
				lang: 'de',
			},
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		},
	},
	runtimeConfig: {
		isMainApp: true,
	},
	extends: ['@orc-hfg/madek-api-nuxt-layer'],
});
