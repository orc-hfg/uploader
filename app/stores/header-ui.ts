import type { PageTitleKeyPath } from '@/types/i18n-keys';

export const useHeaderUIStore = defineStore('header-ui', () => {
	const pageTitleKeyPath = shallowRef<PageTitleKeyPath>();

	const { t } = useI18n();
	const pageTitleTranslation = computed(() => {
		if (!pageTitleKeyPath.value) {
			return '';
		}

		return t(pageTitleKeyPath.value);
	});

	function setPageTitleKeyPath(newPageTitleKeyPath: PageTitleKeyPath): void {
		pageTitleKeyPath.value = newPageTitleKeyPath;
	}

	return {
		pageTitleKeyPath,
		pageTitleTranslation,
		setPageTitleKeyPath,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHeaderUIStore, import.meta.hot));
}
