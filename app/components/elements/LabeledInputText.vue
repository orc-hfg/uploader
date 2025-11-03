<script setup lang="ts">
	import Text from './Text.vue';
	import Value from './Value.vue';

	const { label, value } = defineProps<{
		label: string;
		value?: string;
	}>();

	const isInsideDescriptionList = inject<boolean>('isInsideDescriptionList', false);

	const appLogger = createAppLogger('Component: LabeledInputText');

	if (!isInsideDescriptionList && isDevelopmentEnvironment) {
		appLogger.warn('LabeledInputText should be used inside DescriptionList component for semantic correctness.');
	}
</script>

<template>
	<dt class="text-surface-500">
		{{ label }}
	</dt>
	<dd class="mt-0.5">
		<Text as="p" variant="body-medium">
			<Value :value="value" />
		</Text>
	</dd>
</template>
