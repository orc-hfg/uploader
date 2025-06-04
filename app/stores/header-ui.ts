export const useHeaderUIStore = defineStore('header-ui', () => {
	const titleTranslationKey = shallowRef('');

	const { t } = useI18n();
	const titleTranslationMessage = computed(() => (titleTranslationKey.value ? t(titleTranslationKey.value) : ''),
	);

	return {
		titleTranslationKey,
		titleTranslationMessage,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHeaderUIStore, import.meta.hot));
}
