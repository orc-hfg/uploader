interface FooterActionConfig {
	component: Component;
	props?: {
		label?: string;
		icon?: string;
		type?: string;
		click?: () => void;
		[key: string]: unknown;
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
