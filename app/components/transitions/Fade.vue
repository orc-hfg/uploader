<script setup lang="ts">
	const { duration = 0.25 } = defineProps<{
		duration?: number;
	}>();

	const animationDuration = `${duration}s`;
</script>

<template>
	<Transition name="fade" mode="out-in">
		<slot />
	</Transition>
</template>

<!-- eslint-disable vue/enforce-style-attribute -->
<!--
	IMPORTANT: Do not use <style scoped> for transition components!

	Problem: Vue applies transition classes (like .fade-enter-active) to the slot content,
	but scoped styles generate selectors with data-v-* attributes that only match the
	component where they're defined. Since slot content comes from parent components
	with different data-v-* attributes, the CSS rules won't apply.

	Result: Transitions won't work or behave unexpectedly.
	Solution: Use global styles for transition classes.

	Reference: https://vuejs.org/guide/built-ins/transition#reusable-transitions
-->
<style lang="css">
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity v-bind(animationDuration) var(--ease-smooth);
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	.fade-enter-to,
	.fade-leave-from {
		opacity: 1;
	}
</style>
