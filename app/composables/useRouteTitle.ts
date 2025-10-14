export function useRouteTitle(titleGetter: () => string): void {
	const route = useRoute();

	watchEffect(() => {
		const title = titleGetter();

		if (typeof title === 'string' && title.trim().length > 0) {
			route.meta.pageTitle = title;
		}
	});
}
