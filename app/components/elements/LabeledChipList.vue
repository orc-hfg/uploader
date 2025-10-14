<script setup lang="ts">
	import Chip from 'primevue/chip';
	import Value from './Value.vue';

	export interface ChipItem {
		label: string;
		secondaryLabel?: string;
	}

	type ChipItemValue = string | ChipItem;

	const { label, items = [] } = defineProps<{
		label: string;
		items?: ChipItemValue[];
	}>();

	const isInsideDescriptionList = inject<boolean>('isInsideDescriptionList', false);

	const appLogger = createAppLogger('Component: LabeledChipList');

	/*
	 * Filter out empty strings and normalize items to ChipItem format
	 * Supports both string items and objects with label/secondaryLabel
	 */
	const normalizedItems = computed<ChipItem[]>(() => items
		.filter(Boolean)
		.map((item) => {
			if (typeof item === 'string') {
				return { label: item };
			}

			return item;
		}));

	if (!isInsideDescriptionList && isDevelopmentEnvironment) {
		appLogger.warn('LabeledChipList should be used inside DescriptionList component for semantic correctness.');
	}

	/*
	 * Note: Border styling is applied via Tailwind classes because PrimeVue Chip
	 * does not provide design tokens for border customization. Other properties like
	 * background can be controlled via design tokens in the theme configuration.
	 * See: https://primevue.org/chip/#theming.tokens
	 *
	 * aria-label override: PrimeVue Chip automatically adds aria-label based on the label prop.
	 * For non-interactive chips, aria-label should not be used as it violates ARIA guidelines
	 * (aria-label is only valid on interactive elements or elements with specific ARIA roles).
	 * Setting aria-label to undefined removes this attribute from the rendered element.
	 * See: https://primevue.org/chip/#accessibility
	 */
</script>

<template>
	<dt class="text-surface-500">
		{{ label }}
	</dt>
	<dd class="mt-0.5">
		<div
			v-if="normalizedItems.length > 0"
			class="flex flex-wrap gap-2"
		>
			<Chip
				v-for="(item, index) in normalizedItems"
				:key="index"
				:aria-label="undefined"
				class="border border-surface-400"
			>
				<span class="flex items-center gap-2">
					<span>{{ item.label }}</span>
					<span v-if="item.secondaryLabel" class="text-surface-500">|</span>
					<span
						v-if="item.secondaryLabel"
						class="text-surface-500"
					>
						{{ item.secondaryLabel }}
					</span>
				</span>
			</Chip>
		</div>
		<Value v-else />
	</dd>
</template>
