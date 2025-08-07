export default defineNitroPlugin(() => {
	const config = useRuntimeConfig();
	const publicConfig = config.public;
	const isAuthenticationMockEnabled = publicConfig.enableAuthenticationMock;
	const isAuthenticationInfoEndpointMockEnabled = publicConfig.enableAuthenticationInfoEndpointMock;

	if (isAuthenticationMockEnabled) {
		const serverStartupLogger = createServerStartupLogger('Plugin: debug-info');

		serverStartupLogger.info('Authentication mock is active.');
	}

	if (isAuthenticationInfoEndpointMockEnabled) {
		const serverStartupLogger = createServerStartupLogger('Plugin: debug-info');

		serverStartupLogger.info('Authentication info endpoint mock is active.');
	}
});
