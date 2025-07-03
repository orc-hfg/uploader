import * as Sentry from '@sentry/nuxt';

const runtimeConfig = useRuntimeConfig();
const { sentry } = runtimeConfig.public;

function extractHostname(raw: string | undefined): string {
	if (raw === undefined) {
		return '';
	}

	try {
		const url = raw.includes('://') ? raw : `http://${raw}`;

		return new URL(url).hostname.toLowerCase();
	}
	catch {
		return '';
	}
}

// Only initialize Sentry if it is enabled (see nuxt.config.ts)
if (sentry.enabled) {
	Sentry.init({
		dsn: typeof sentry.dsn === 'string' ? sentry.dsn : '',

		/*
		 * We recommend adjusting this value in production, or using tracesSampler
		 * For finer control
		 */
		tracesSampleRate: 1,

		// Setting this option to true will print useful information to the console while you're setting up Sentry.
		debug: false,

		// Only send events from the development server
		beforeSend(event) {
			const isHostAllowed = extractHostname(event.request?.headers?.host) === sentry.allowHostname;

			if (!event.request || !isHostAllowed) {
				// eslint-disable-next-line unicorn/no-null
				return null;
			}

			// Sensitive data scrubbing
			const SENSITIVE_COOKIES = new Set(['madek-session']);
			const SENSITIVE_PARAMETERS = new Set(['responsible_user_id']);

			// Remove sensitive cookies from request
			if (event.request.cookies) {
				for (const key of SENSITIVE_COOKIES) {
					if (key in event.request.cookies) {
						event.request.cookies[key] = '[Filtered (sentry.server.config.ts)]';
					}
				}
			}

			// Remove sensitive parameters from request query string
			const { query_string: queryString } = event.request;

			if (typeof queryString === 'string' && queryString.length > 0) {
				const searchParameters = new URLSearchParams(queryString);

				for (const key of searchParameters.keys()) {
					if (SENSITIVE_PARAMETERS.has(key)) {
						searchParameters.set(key, '[Filtered (sentry.server.config.ts)]');
					}
				}

				event.request.query_string = searchParameters.toString();
			}

			return event;
		},
	});
}
