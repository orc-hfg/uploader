<script setup lang="ts">
	import Value from './Value.vue';

	const { label, value } = defineProps<{
		label?: string;
		value?: string;
	}>();
</script>

<template>
	<dl v-if="label">
		<dt class="text-surface-500">
			{{ label }}
		</dt>
		<dd class="mt-0.5">
			<Value :value="value" />
		</dd>
	</dl>
	<div v-else />
</template>
