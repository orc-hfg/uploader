import type { TranslationKeyPath } from '@@/types/i18n-keys';

export const useHeaderUIStore = defineStore('header-ui', () => {
	const titleKeyPath = shallowRef<TranslationKeyPath>();

	const { t } = useI18n();
	const titleTranslation = computed(() => (titleKeyPath.value ? t(titleKeyPath.value) : ''),
	);

	function setPageTitle(newTitleKeyPath: TranslationKeyPath): void {
		titleKeyPath.value = newTitleKeyPath;
	}

	return {
		titleKeyPath,
		titleTranslation,
		setPageTitle,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHeaderUIStore, import.meta.hot));
}
