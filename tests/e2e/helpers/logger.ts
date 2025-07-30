import { consola } from 'consola';

/*
 * ⚠️ E2E TEST LOGGER ONLY ⚠️
 *
 * This logger is specifically designed for E2E tests and should NEVER be used
 * in the main application code. For the main application, use the logger from:
 * '@orc-hfg/madek-api-nuxt-layer/shared/logger'
 *
 * This E2E logger provides the same interface as the main logger but uses
 * consola directly without Nuxt runtime configuration.
 */
export interface Logger {
	debug: (source: string, message: string, data?: unknown) => void;
	info: (source: string, message: string, data?: unknown) => void;
	warn: (source: string, message: string, data?: unknown) => void;
	error: (source: string, message: string, data?: unknown) => void;
}

function log(level: 'debug' | 'info' | 'warn' | 'error', source: string, message: string, data?: unknown): void {
	if (data === undefined) {
		consola[level](`[${source}] ${message}`);
	}
	else {
		consola[level](`[${source}] ${message}`, data);
	}
}

/*
 * Creates a logger instance for E2E tests only.
 *
 * ⚠️ DO NOT USE IN MAIN APPLICATION CODE ⚠️
 * Use '@orc-hfg/madek-api-nuxt-layer/shared/logger' instead.
 */
export function createLogger(): Logger {
	return {
		debug: (source: string, message: string, data?: unknown): void => { log('debug', source, message, data); },
		info: (source: string, message: string, data?: unknown): void => { log('info', source, message, data); },
		warn: (source: string, message: string, data?: unknown): void => { log('warn', source, message, data); },
		error: (source: string, message: string, data?: unknown): void => { log('error', source, message, data); },
	};
}
