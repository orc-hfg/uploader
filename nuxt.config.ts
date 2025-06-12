import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},
	experimental: {
		// See: https://www.youtube.com/watch?v=SXk-L19gTZk
		typedPages: true,
	},
	compatibilityDate: '2025-05-09',
	devtools: { enabled: true },
	typescript: {
		typeCheck: true,
	},
	css: ['@/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss(), devtoolsJson()],
	},
	modules: [
		'@nuxt/eslint',
		'@nuxt/test-utils/module',
		'@nuxtjs/google-fonts',
		'@nuxtjs/i18n',
		'@primevue/nuxt-module',
		'@vueuse/nuxt',
	],

	/*
	 * Important note: Pinia only works if it is installed once in the project (in this case Pinia is installed in the extended madek-api-nuxt-layer)
	 * Multiple Pinia installations do not work with symlinked dependencies (e.g. madek-api-nuxt-layer linked via `npm link`)
	 * See related discussions here: https://github.com/vuejs/pinia/discussions/2378 / https://github.com/vuejs/pinia/pull/2699
	 */
	// Auto-import of stores folder ensures the same behavior as in the madek-api-nuxt-layer
	imports: {
		dirs: ['stores'],
	},
	// Support knip which is used to check for unused imports
	components: {
		dirs: [],
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
	googleFonts: {
		display: 'swap',
		families: {
			// eslint-disable-next-line ts/no-magic-numbers
			'Instrument+Sans': [400],
		},
	},
	i18n: {
		baseUrl: 'http://localhost:3000/',
		defaultLocale: 'de',
		strategy: 'prefix',
		locales: [
			{ code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
			{ code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
		],
		detectBrowserLanguage: {
			useCookie: true,
			alwaysRedirect: true,
		},
		bundle: {
			// See: https://github.com/nuxt-modules/i18n/issues/3238#issuecomment-2672492536
			optimizeTranslationDirective: false,
		},
	},
	primevue: {
		importTheme: { from: '@/theme/primevue-theme-application.ts' },
	},
	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		},
	},
	runtimeConfig: {
		isMainApp: true,
	},
	$production: {
		i18n: {
			baseUrl: 'https://dev.madek.hfg-karlsruhe.de/uploader/',
		},
	},
	extends: ['@orc-hfg/madek-api-nuxt-layer'],
});
