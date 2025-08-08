export default defineNitroPlugin(() => {
	const config = useRuntimeConfig();
	const publicConfig = config.public;
	const isAuthenticationMockEnabled = publicConfig.enableAuthenticationMock;
	const isAuthenticationInfoEndpointMockEnabled = publicConfig.enableAuthenticationInfoEndpointMock;

	if (!isAuthenticationMockEnabled && !isAuthenticationInfoEndpointMockEnabled) {
		return;
	}

	const serverStartupLogger = createServerStartupLogger('Plugin: debug-info');

	serverStartupLogger.info('=== MOCKS ===');

	const features = [
		{ name: 'Authentication mock', isEnabled: publicConfig.enableAuthenticationMock },
		{ name: 'Authentication info endpoint mock', isEnabled: publicConfig.enableAuthenticationInfoEndpointMock },
	];

	for (const { name, isEnabled } of features) {
		serverStartupLogger.info(`${name}: ${isEnabled ? 'enabled' : 'disabled'}`);
	}
});
