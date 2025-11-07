import type Button from 'primevue/button';

interface SubmitButtonProps {
	label: string;
	type: 'submit';
	form: string;
	icon?: string;
	class?: string;
}

interface ActionButtonProps {
	label: string;
	type: 'button';
	click: () => void;
	icon?: string;
	class?: string;
}

export type FooterButtonProps = SubmitButtonProps | ActionButtonProps;

interface FooterActionConfig {
	component: typeof Button;
	props: FooterButtonProps;
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
