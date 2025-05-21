export function useMetaTitle(pageTitle?: string | Ref<string | undefined | null>): ComputedRef<string> {
	const appConfig = useAppConfig();

	return computed(() => {
		let pageTitleValue = '';

		if (typeof pageTitle === 'string') {
			pageTitleValue = pageTitle;
		}
		else if (pageTitle && 'value' in pageTitle) {
			const referenceValue = pageTitle.value;
			if (typeof referenceValue === 'string' && referenceValue.trim() !== '') {
				pageTitleValue = referenceValue;
			}
		}

		const appTitle = appConfig.title;
		const hasValidAppTitle = typeof appTitle === 'string' && appTitle.trim() !== '';

		if (!pageTitleValue && !hasValidAppTitle) {
			return '';
		}

		if (pageTitleValue && !hasValidAppTitle) {
			return pageTitleValue;
		}

		if (!pageTitleValue && hasValidAppTitle) {
			return appTitle;
		}

		return `${pageTitleValue} – ${String(appTitle)}`;
	});
}
