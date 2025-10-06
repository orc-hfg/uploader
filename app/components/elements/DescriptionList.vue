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
