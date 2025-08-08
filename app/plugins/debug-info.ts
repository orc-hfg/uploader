interface DebugInfoLogger {
	info: (message: string) => void;
}

interface PublicRuntimeConfig {
	enableAuthenticationMock: boolean;
	enableAuthenticationInfoEndpointMock: boolean;
}

function logDebugInfo(logger: DebugInfoLogger, publicConfig: PublicRuntimeConfig): void {
	const features = [
		{ name: 'Authentication mock', isEnabled: publicConfig.enableAuthenticationMock },
		{ name: 'Authentication info endpoint mock', isEnabled: publicConfig.enableAuthenticationInfoEndpointMock },
	];

	logger.info('=== MOCKS ===');
	for (const { name, isEnabled } of features) {
		logger.info(`${name}: ${isEnabled ? 'enabled' : 'disabled'}`);
	}
}

export default defineNuxtPlugin({
	name: 'debug-info',
	setup() {
		const config = useRuntimeConfig();
		const publicConfig = config.public;
		const isDebugLoggingEnabled = publicConfig.enableDebugLogging;

		if (!isDebugLoggingEnabled) {
			return;
		}

		const appLogger = createAppLogger('Plugin: debug-info');
		logDebugInfo(appLogger, publicConfig);
	},
});
