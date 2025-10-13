<script setup lang="ts">
	/*
	* Provides context to child components (e.g. LabeledInputText, LabeledChipList)
	* to validate that they are used within a semantically correct <dl> element.
	* Child components inject this value to show development warnings if used standalone.
	*/
	provide('isInsideDescriptionList', true);
</script>

<template>
	<dl>
		<slot />
	</dl>
</template>

<style scoped>
	/*
	* This style block is necessary despite the project's preference for Tailwind-only styling because:
	* 1. Vue's :deep() pseudo-class is required to style slot content (dt/dd elements)
	* 2. Complex selectors like "dd + dt" cannot be expressed with inline Tailwind classes
	*/
	@reference "@/assets/css/main.css";

	dl {
		@apply flex flex-col;
	}

	dl :deep(dd + dt) {
		@apply border-t border-surface-300 pt-3;
	}

	dl :deep(dt) {
		@apply pb-0.5;
	}

	dl :deep(dd) {
		@apply pb-3;
	}

	dl :deep(dt:first-child) {
		@apply pt-0;
	}

	dl :deep(dd:last-child) {
		@apply pb-0;
	}
</style>
