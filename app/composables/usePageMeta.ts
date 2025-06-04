import { useI18n } from 'vue-i18n';

export function usePageMeta(translationKey: string): string {
	const { t } = useI18n();

	const translationMessage = t(translationKey);
	const metaTitle = useMetaTitle(translationMessage);

	useHead({
		title: metaTitle,
	});

	return translationMessage;
}
