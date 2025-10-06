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
