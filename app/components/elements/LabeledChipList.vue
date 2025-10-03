<script setup lang="ts">
	import Chip from 'primevue/chip';
	import Value from './Value.vue';

	const { label, items = [] } = defineProps<{
		label?: string;
		items?: string[];
	}>();

/*
 * Note: Border styling is applied via Tailwind classes because PrimeVue Chip
 * does not provide design tokens for border customization. Other properties like
 * background can be controlled via design tokens in the theme configuration.
 * See: https://primevue.org/chip/#theming.tokens
 */
</script>

<template>
	<dl v-if="label">
		<dt class="text-surface-500">
			{{ label }}
		</dt>
		<dd class="mt-0.5">
			<div
				v-if="items.length > 0"
				class="flex flex-wrap gap-2"
			>
				<Chip
					v-for="(item, index) in items"
					:key="index"
					:label="item"
					class="border border-surface-400"
				/>
			</div>
			<Value v-else />
		</dd>
	</dl>
	<div v-else />
</template>
