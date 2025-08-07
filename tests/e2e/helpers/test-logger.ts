import { consola } from 'consola';

/*
 * ⚠️ E2E TEST LOGGER ONLY ⚠️
 *
 * This logger is specifically designed for E2E tests and should NEVER be used
 * in the main application code. For the main application, use the logger from:
 * '@orc-hfg/madek-api-nuxt-layer/app/utils/app-logger' or
 * '@orc-hfg/madek-api-nuxt-layer/server/utils/server-logger'
 *
 * This E2E logger provides the same interface as the app and server loggers but
 * uses consola directly without Nuxt runtime configuration.
 */
interface Logger {
	debug: (message: string, data?: unknown) => void;
	info: (message: string, data?: unknown) => void;
	warn: (message: string, data?: unknown) => void;
	error: (message: string, data?: unknown) => void;
}

/*
 * Creates a logger instance for E2E tests only.
 *
 * ⚠️ DO NOT USE IN MAIN APPLICATION CODE ⚠️
 * Use '@orc-hfg/madek-api-nuxt-layer/app/utils/app-logger' or
 * '@orc-hfg/madek-api-nuxt-layer/server/utils/server-logger' instead.
 */
export function createTestLogger(source: string): Logger {
	const loggerPrefix = `[E2E Test Logger] [${source}]`;

	function log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown): void {
		if (data === undefined) {
			consola[level](loggerPrefix, message);
		}
		else {
			consola[level](loggerPrefix, message, data);
		}
	}

	return {
		debug: (message: string, data?: unknown): void => { log('debug', message, data); },
		info: (message: string, data?: unknown): void => { log('info', message, data); },
		warn: (message: string, data?: unknown): void => { log('warn', message, data); },
		error: (message: string, data?: unknown): void => { log('error', message, data); },
	};
}
