import * as Sentry from '@sentry/nuxt';

Sentry.init({
	dsn: 'https://39dc4f041f52b538201e7f8cc495d884@o4509604852465664.ingest.de.sentry.io/4509604854104144',

	/*
	 * We recommend adjusting this value in production, or using tracesSampler
	 * For finer control
	 */
	tracesSampleRate: 1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
