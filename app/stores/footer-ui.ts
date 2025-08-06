interface ActionProps {
	label?: string;
	click?: () => void;
	[key: string]: unknown;
}

export const useFooterUIStore = defineStore('footer-ui', () => {
	const leftActionComponent = shallowRef<Component>();
	const leftActionProps = ref<ActionProps>();

	const rightActionComponent = shallowRef<Component>();
	const rightActionProps = ref<ActionProps>();

	function reset(): void {
		leftActionComponent.value = undefined;
		leftActionProps.value = {};
		rightActionComponent.value = undefined;
		rightActionProps.value = {};
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
