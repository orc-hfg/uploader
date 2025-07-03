import * as Sentry from '@sentry/nuxt';

Sentry.init({

	/*
	 * If set up, you can use your runtime config here
	 * Dsn: useRuntimeConfig().public.sentry.dsn,
	 */
	dsn: 'https://39dc4f041f52b538201e7f8cc495d884@o4509604852465664.ingest.de.sentry.io/4509604854104144',

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

	// If you don't want to use Session Replay, just remove the line below:
	integrations: [Sentry.replayIntegration()],

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
