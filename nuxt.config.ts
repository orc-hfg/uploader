import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

// Recognize CI environment (e.g. GitHub Actions)
const isCI = Boolean(import.meta.env.CI);

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
		// See: https://github.com/ChromeDevTools/vite-plugin-devtools-json
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
		/*
		 * IMPORTANT: Note the different spelling compared to app.baseURL
		 * - Nuxt core uses: app.baseURL (with capital URL)
		 * - Nuxt i18n uses: i18n.baseUrl (with lowercase u)
		 *
		 * This is not a mistake - each module expects its documented spelling.
		 * Changing the spelling will break the respective module's functionality.
		 * Always follow the official documentation for each module.
		 *
		 * CRITICAL: i18n.baseUrl must NOT include the app path!
		 *
		 * WRONG: baseUrl: 'http://localhost:3000/uploader/'
		 * CORRECT: baseUrl: 'http://localhost:3000/'
		 *
		 * Why: Nuxt i18n automatically combines baseUrl + app.baseURL + route
		 * - If baseUrl includes /uploader/: http://localhost:3000/uploader/ + /uploader/ + /de/projekte = /uploader/uploader/de/projekte
		 * - If baseUrl is server only: http://localhost:3000/ + /uploader/ + /de/projekte = /uploader/de/projekte
		 *
		 * The baseUrl should only specify "where is the server", not "where is the app".
		 * The app path is automatically added from app.baseURL.
		 */
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
		/*
		 * IMPORTANT: Note the different spelling compared to i18n.baseUrl
		 * - Nuxt core uses: app.baseURL (with capital URL)
		 * - Nuxt i18n uses: i18n.baseUrl (with lowercase u)
		 *
		 * This is not a mistake - each module expects its documented spelling.
		 * Changing the spelling will break the respective module's functionality.
		 * Always follow the official documentation for each module.
		 *
		 * CONFUSING NAMING: Despite being called "baseURL", this is NOT a full URL!
		 *
		 * ❌ MISLEADING: The name "baseURL" suggests a full URL like "https://example.com/"
		 * ✅ REALITY: It's only a path like "/uploader/"
		 *
		 * Semantically correct naming would be:
		 * - app.basePath = "/uploader/" (what this actually is)
		 * - i18n.baseURL = "https://example.com/" (what i18n.baseUrl actually is)
		 *
		 * This naming inconsistency is a known issue in the Nuxt ecosystem but cannot
		 * be changed without breaking changes. Be aware of this when working with URLs:
		 * - app.baseURL = path only ("/uploader/")
		 * - i18n.baseUrl = full URL ("https://example.com/")
		 */
		baseURL: '/uploader/',
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
			// Enable debug logging (logger)
			enableDebugLogging: false,

			// Enable authentication mock for development and testing (session-based authentication)
			enableAuthenticationMock: false,

			// Enable authentication info endpoint mock for E2E testing with session-based authentication
			enableAuthenticationInfoEndpointMock: false,

			/*
			 * Server URL for authentication endpoints
			 *
			 * IMPORTANT: Different URL structures between environments:
			 * - Local Development: 'http://localhost:3000/uploader/' (authentication mock runs under app path)
			 * - Production: 'https://server/' (authentication system runs at root path)
			 *
			 * This difference exists because local authentication mock is implemented as a Nuxt Server Plugin,
			 * which is bound to app.baseURL and cannot serve routes outside this scope.
			 *
			 * The authentication composable uses this serverUrl to build correct endpoint URLs for each environment.
			 */
			serverUrl: 'http://localhost:3000/uploader/',

			// Authentication configuration
			authentication: {
				appPathName: 'uploader',
				basePath: 'auth/',
				signInPathName: 'sign-in',
				signOutPathName: 'sign-out',
				systemPathName: 'auth-systems',
				systemPath: 'auth-systems/',
				defaultSystemName: 'password',
				emailOrLoginParameter: 'email-or-login',
				returnToParameter: 'return-to',
				csrfCookieName: 'madek.auth.anti-csrf-token',
				csrfHeaderName: 'madek.auth.anti-csrf-token',
				sessionCookieName: 'madek-session',
			},

			// Sentry configuration
			sentry: {
				// These options are used in both sentry.client.config.ts and sentry.server.config.ts
				allowHostname: 'dev.madek.hfg-karlsruhe.de',

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
	$development: {
		runtimeConfig: {
			public: {
				enableDebugLogging: true,
				enableAuthenticationMock: true,
			},
		},
	},
	$production: {
		i18n: {
			baseUrl: 'https://dev.madek.hfg-karlsruhe.de/',
		},
		runtimeConfig: {
			public: {
				// Authentication endpoints are only available at root path on development server
				serverUrl: 'https://dev.madek.hfg-karlsruhe.de/',
			},
		},
	},
	extends: ['@orc-hfg/madek-api-nuxt-layer'],
});
