export function usePageMeta(pageTitle: string): string {
	const metaTitle = useMetaTitle(pageTitle);

	useHead({
		title: metaTitle,
	});

	return pageTitle;
}
