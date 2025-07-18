import process from 'node:process';
import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

const isCI = Boolean(process.env.CI);

const LOCAL_SERVER_URL = 'http://localhost:3000/';
const DEVELOPMENT_SERVER_HOSTNAME = 'dev.madek.hfg-karlsruhe.de';
const DEVELOPMENT_SERVER_URL = `https://${DEVELOPMENT_SERVER_HOSTNAME}/`;
const APP_PATH_NAME = 'uploader';
const AUTHENTICATION_PATH_NAME = 'auth';
const AUTHENTICATION_SIGN_IN_PATH_NAME = 'sign-in';
const AUTHENTICATION_SYSTEM_PATH_NAME = 'auth-systems';

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
		'@sentry/nuxt/module',
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
		baseUrl: LOCAL_SERVER_URL,
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
	sentry: {
		sourceMapsUploadOptions: {
			org: 'rene-zschoch',
			project: 'javascript-nuxt',
		},
	},
	sourcemap: {
		/*
		 * Disable source maps in CI to prevent buffer overflow issues during E2E tests
		 * Keep them enabled locally for debugging and in production for Sentry
		 */
		client: isCI ? false : 'hidden',
		server: !isCI,
	},
	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		},
	},
	runtimeConfig: {

		/*
		 * Flag indicating this is the main application (not a layer).
		 * Used in plugins to enforce config requirements during development.
		 */
		mainApplication: true,
		public: {
			serverUrl: LOCAL_SERVER_URL,
			appPathName: APP_PATH_NAME,
			authentication: {
				basePath: `${AUTHENTICATION_PATH_NAME}/${AUTHENTICATION_SIGN_IN_PATH_NAME}/`,
				signInPathName: AUTHENTICATION_SIGN_IN_PATH_NAME,
				systemPathName: AUTHENTICATION_SYSTEM_PATH_NAME,
				systemPath: `${AUTHENTICATION_SYSTEM_PATH_NAME}/`,
				defaultSystemName: 'password',
				emailOrLoginParameter: 'email-or-login',
				returnToParameter: 'return-to',
				csrfCookieName: 'madek.auth.anti-csrf-token',
				csrfHeaderName: 'madek.auth.anti-csrf-token',
				sessionCookieName: 'madek-session',
			},
			sentry: {
				// These options are used in both sentry.client.config.ts and sentry.server.config.ts
				allowHostname: DEVELOPMENT_SERVER_HOSTNAME,

				/*
				 * See: https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#enabled
				 * Set to true to enable Sentry (NUXT_PUBLIC_SENTRY_ENABLED=true)
				 */
				enabled: false,

				/*
				 * See: https://docs.sentry.io/platforms/javascript/configuration/options/#dsn
				 * Set to empty string on production server (NUXT_PUBLIC_SENTRY_DSN=)
				 */
				dsn: 'https://39dc4f041f52b538201e7f8cc495d884@o4509604852465664.ingest.de.sentry.io/4509604854104144',
			},
		},
	},
	$production: {
		i18n: {
			baseUrl: `${DEVELOPMENT_SERVER_URL}${APP_PATH_NAME}/`,
		},
		runtimeConfig: {
			public: {
				serverUrl: DEVELOPMENT_SERVER_URL,
				authentication: {
					basePath: `${AUTHENTICATION_PATH_NAME}/${AUTHENTICATION_SIGN_IN_PATH_NAME}/`,
				},
			},
		},
	},
	extends: ['@orc-hfg/madek-api-nuxt-layer'],
});
