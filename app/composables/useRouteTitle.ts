export function useRouteTitle(titleOrGetter: MaybeRefOrGetter<string>): void {
	const route = useRoute();

	watchEffect(() => {
		route.meta.pageTitle = toValue(titleOrGetter);
	});
}
