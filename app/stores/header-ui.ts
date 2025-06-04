export const useHeaderUIStore = defineStore('header-ui', () => {
	const title = shallowRef('');

	return {
		title,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHeaderUIStore, import.meta.hot));
}
