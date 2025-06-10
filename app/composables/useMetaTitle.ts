export function useMetaTitle(pageTitle?: string): ComputedRef<string> {
	const appConfig = useAppConfig();
	const appTitle = appConfig.title;

	return computed(() => {
		const hasValidPageTitle = typeof pageTitle === 'string' && pageTitle.trim() !== '';

		if (!hasValidPageTitle) {
			return appTitle;
		}

		return `${pageTitle} – ${appTitle}`;
	});
}
