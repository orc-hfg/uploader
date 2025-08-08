export default defineNitroPlugin(() => {
	const config = useRuntimeConfig();
	const publicConfig = config.public;
	const isAuthenticationMockEnabled = publicConfig.enableAuthenticationMock;
	const isAuthenticationInfoEndpointMockEnabled = publicConfig.enableAuthenticationInfoEndpointMock;

	const serverStartupLogger = createServerStartupLogger('Plugin: debug-info');

	if (isAuthenticationMockEnabled) {
		serverStartupLogger.info('Authentication mock is active.');
	}

	if (isAuthenticationInfoEndpointMockEnabled) {
		serverStartupLogger.info('Authentication info endpoint mock is active.');
	}
});
