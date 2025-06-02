import { acceptHMRUpdate, defineStore } from 'pinia';

export const useHeaderUIStore = defineStore('header-ui', () => {
	const title = ref('');

	return {
		title,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHeaderUIStore, import.meta.hot));
}
