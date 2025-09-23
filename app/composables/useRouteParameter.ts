/*
 * Composable for safe route parameter extraction with i18n support
 *
 * This composable is necessary because Nuxt i18n modifies route names by adding locale suffixes.
 * Instead of 'project-id', we get 'project-id___de' and 'project-id___en', which breaks
 * the direct typed route approach: useRoute('project-id').
 *
 * Without i18n, we could use Nuxt's experimental typed pages feature:
 * const route = useRoute('project-id') // Would work without i18n
 *
 * With i18n, route names become:
 * - 'project-id___de' for German routes
 * - 'project-id___en' for English routes
 *
 * This composable handles the TypeScript union type issues and provides
 * a clean API for accessing route parameters regardless of locale.
 *
 * See: https://github.com/nuxt/nuxt/issues/21048
 */
export function useRouteParameter(parameter: string): ComputedRef<string | undefined> {
	const route = useRoute();

	return computed(() => {
		const routeParameters: Record<string, string> = route.params;

		return parameter in routeParameters ? routeParameters[parameter] : undefined;
	});
}
