import type Button from 'primevue/button';
import type { FooterButtonProps } from '@/composables/useFooterActions';

export const useFooterUIStore = defineStore('footer-ui', () => {
	const leftActionComponent = shallowRef<typeof Button>();
	const leftActionProps = ref<FooterButtonProps>();

	const rightActionComponent = shallowRef<typeof Button>();
	const rightActionProps = ref<FooterButtonProps>();

	function reset(): void {
		leftActionComponent.value = undefined;
		leftActionProps.value = undefined;
		rightActionComponent.value = undefined;
		rightActionProps.value = undefined;
	}

	return {
		leftActionComponent,
		leftActionProps,
		rightActionComponent,
		rightActionProps,
		reset,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFooterUIStore, import.meta.hot));
}
