<script setup lang="ts">
	import Text from '@/components/elements/Text.vue';
	import Value from '@/components/elements/Value.vue';

	const { title, message } = defineProps<{
		title?: string;
		message: string;
	}>();
</script>

<template>
	<div class="mt-40 text-center text-surface-400">
		<Text
			v-if="title"
			as="h2"
			variant="display-small"
			class="mb-8"
		>
			{{ title }}
		</Text>
		<Text
			as="p"
			variant="display-small"
		>
			<Value :value="message" />
		</Text>
	</div>
</template>
