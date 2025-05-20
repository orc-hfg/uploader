export function useTitle(pageTitle?: string | Ref<string | undefined | null>): ComputedRef<string> {
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

		if (pageTitleValue) {
			return typeof appConfig.title === 'string'
				? `${pageTitleValue} – ${appConfig.title}`
				: pageTitleValue;
		}

		return typeof appConfig.title === 'string'
			? appConfig.title
			: '';
	});
}
