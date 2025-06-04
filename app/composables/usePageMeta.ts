import type { TranslationKeyPath } from '@@/types/i18n-keys';
import { useI18n } from 'vue-i18n';

export function usePageMeta(translationKeyPath: TranslationKeyPath): TranslationKeyPath {
	const { t } = useI18n();

	const translationMessage = t(translationKeyPath);
	const metaTitle = useMetaTitle(translationMessage);

	useHead({
		title: metaTitle,
	});

	return translationKeyPath;
}
