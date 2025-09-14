import type { PublicRuntimeConfig } from 'nuxt/schema';

function logInfo(logger: Logger, publicConfig: PublicRuntimeConfig): void {
	const features = [
		{ name: 'Authentication mock', isEnabled: publicConfig.enableAuthenticationMock },
		{ name: 'Authentication info endpoint mock', isEnabled: publicConfig.enableAuthenticationInfoEndpointMock },
	];

	logger.info('=== APP FEATURES ===');
	for (const { name, isEnabled } of features) {
		logger.info(`${name}: ${isEnabled ? 'enabled' : 'disabled'}`);
	}
}

export default defineNuxtPlugin({
	name: 'info-log',
	setup() {
		const config = useRuntimeConfig();
		const publicConfig = config.public;
		const isLoggingEnabled = publicConfig.enableLogging;

		if (!isLoggingEnabled) {
			return;
		}

		const appLogger = createAppLogger('Plugin: info-log');
		logInfo(appLogger, publicConfig);
	},
});
