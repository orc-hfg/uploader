interface FooterActionConfig {
	component: Component;
	props?: {
		label?: string;
		icon?: string;
		class?: string;
		type?: string;
		form?: string;
		click?: () => void;
	};
}

interface FooterConfig {
	left?: FooterActionConfig;
	right?: FooterActionConfig;
}

export function useFooterActions(config?: MaybeRefOrGetter<FooterConfig>): void {
	const footerUIStore = useFooterUIStore();

	if (config) {
		onMounted(() => {
			const currentConfig = toValue(config);

			footerUIStore.leftActionComponent = currentConfig.left?.component;
			footerUIStore.leftActionProps = currentConfig.left?.props;

			footerUIStore.rightActionComponent = currentConfig.right?.component;
			footerUIStore.rightActionProps = currentConfig.right?.props;
		});
	}

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
}
