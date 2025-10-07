export function useRouteTitle(titleOrGetter: MaybeRefOrGetter<string>): void {
	const route = useRoute();

	watchEffect(() => {
		const title = toValue(titleOrGetter);

		if (typeof title === 'string' && title.trim().length > 0) {
			route.meta.pageTitle = title;
		}
	});
}
