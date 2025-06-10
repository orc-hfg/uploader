export function useMetaTitle(pageTitle?: MaybeRef<string | undefined>): ComputedRef<string> {
	const appConfig = useAppConfig();
	const appTitle = appConfig.title;

	return computed(() => {
		const pageTitleValue = toValue(pageTitle);
		const hasValidPageTitle = typeof pageTitleValue === 'string' && pageTitleValue.trim() !== '';

		if (!hasValidPageTitle) {
			return appTitle;
		}

		return `${pageTitleValue} – ${appTitle}`;
	});
}
