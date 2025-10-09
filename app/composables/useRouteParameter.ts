/*
 * Composable for safe route parameter extraction
 *
 * This composable encapsulates the TypeScript type casting required to access route.params
 * without type errors. TypeScript sees route.params as a union type that includes
 * Record<never, never> (empty object), which prevents direct property access.
 *
 * Without this composable, you would need to write:
 * const id = (route.params as { id?: string }).id;
 *
 * With this composable:
 * const id = useRouteParameter('id');
 *
 * This provides a cleaner API and centralizes the type casting logic in one place.
 */
export function useRouteParameter(parameter: string): ComputedRef<string | undefined> {
	const route = useRoute();

	return computed(() => {
		const routeParameters: Record<string, string> = route.params;

		return parameter in routeParameters ? routeParameters[parameter] : undefined;
	});
}
