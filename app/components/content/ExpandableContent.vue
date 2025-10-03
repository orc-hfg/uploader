<script setup lang="ts">
	const { id, isExpanded, collapsedHeight = 150, expansionThreshold = 50 } = defineProps<{
		id?: string;
		isExpanded?: boolean;
		collapsedHeight?: number;
		expansionThreshold?: number;
	}>();

	const emit = defineEmits<{
		contentNeedsExpansionStateChange: [contentNeedsExpansion: boolean];
	}>();

	/*
	* Two-wrapper structure for accurate height measurement:
	* - Outer: applies max-height constraint and overflow handling
	* - Inner: no constraints, provides true content height via ResizeObserver
	*/
	const contentElement = useTemplateRef<HTMLElement>('content');
	const actualContentHeight = shallowRef(0);

	/*
	* Observe height changes continuously because content loads asynchronously.
	* A computed property would only calculate once and miss subsequent DOM changes
	* when async data is rendered. ResizeObserver reacts to every height change.
	*/
	useResizeObserver(contentElement, (entries) => {
		const entry = entries[0];

		if (entry) {
			const { height } = entry.contentRect;

			actualContentHeight.value = Math.ceil(height);
		}
	});

	const shouldShowExpansionButton = computed(
		() => actualContentHeight.value > collapsedHeight + expansionThreshold,
	);

	const maxHeight = computed(() => (shouldShowExpansionButton.value ? `${collapsedHeight}px` : 'none'),
	);

	const expandedHeight = computed(() => `${actualContentHeight.value}px`);

	watchEffect(() => {
		emit('contentNeedsExpansionStateChange', shouldShowExpansionButton.value);
	});
</script>

<template>
	<div class="relative">
		<div
			:id="id"
			class="
     wrapper overflow-hidden transition-[max-height] duration-(--duration-fast)
     ease-(--ease-smooth)
     motion-reduce:transition-none
   "
			:class="{ 'is-expanded': isExpanded }"
		>
			<div ref="content">
				<slot />
			</div>

			<div
				v-if="!isExpanded && shouldShowExpansionButton"
				class="
      pointer-events-none absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-b
      from-transparent to-white
    "
			/>
		</div>
	</div>
</template>

<style scoped>
	.wrapper {
		max-height: v-bind(maxHeight);

		&.is-expanded {
			max-height: v-bind(expandedHeight);
		}
	}
</style>
