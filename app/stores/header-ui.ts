import type { PageTitleKeyPath } from '@/types/i18n-keys';

export const useHeaderUIStore = defineStore('header-ui', () => {
	const pageTitle = shallowRef<string>();
	const pageTitleKeyPath = shallowRef<PageTitleKeyPath>();

	const { t } = useI18n();
	const pageTitleDisplay = computed(() => {
		if (pageTitle.value !== undefined) {
			return pageTitle.value;
		}

		if (pageTitleKeyPath.value !== undefined) {
			return t(pageTitleKeyPath.value);
		}

		return '';
	});

	function setPageTitle(title: string): void {
		pageTitle.value = title;
		pageTitleKeyPath.value = undefined;
	}

	function setPageTitleByKeyPath(keyPath: PageTitleKeyPath): void {
		pageTitleKeyPath.value = keyPath;
		pageTitle.value = undefined;
	}

	return {
		pageTitle,
		pageTitleKeyPath,
		pageTitleDisplay,
		setPageTitle,
		setPageTitleByKeyPath,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHeaderUIStore, import.meta.hot));
}
