import * as Sentry from '@sentry/nuxt';

const runtimeConfig = useRuntimeConfig();
const { sentry } = runtimeConfig.public;

const isHostAllowed = location.hostname === sentry.allowHostname;

// Only initialize Sentry if it is enabled (see nuxt.config.ts) and the current host is the allowed hostname
if (sentry.enabled && isHostAllowed) {
	Sentry.init({
		// Match scripts loaded from exactly our server URL
		allowUrls: [new RegExp(runtimeConfig.public.serverUrl, 'u')],
		dsn: typeof sentry.dsn === 'string' ? sentry.dsn : '',

		/*
		 * We recommend adjusting this value in production, or using tracesSampler
		 * For finer control
		 */
		tracesSampleRate: 1,

		/*
		 * This sets the sample rate to be 10%. You may want this to be 100% while
		 * In development and sample at a lower rate in production
		 */
		replaysSessionSampleRate: 0.1,

		/*
		 * If the entire session is not sampled, use the below sample rate to sample
		 * Sessions when an error occurs.
		 */
		replaysOnErrorSampleRate: 1,

		/*
		 * If you don't want to use Session Replay, just remove the entry below:
		 * integrations: [Sentry.replayIntegration(), Sentry.piniaIntegration(usePinia())],
		 */
		integrations: [Sentry.piniaIntegration(usePinia())],

		// Setting this option to true will print useful information to the console while you're setting up Sentry.
		debug: false,
	});
}
