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
<style>
	/*
	* This style block is necessary despite the project's preference for Tailwind-only styling because:
	* 1. Transition classes must apply to slot content from parent components
	*    - Vue applies transition classes (like .fade-enter-active) to slot content
	*    - Scoped styles only match elements with the same data-v-* attribute
	*    - Slot content has different data-v-* attributes from parent components
	*    - Result: Scoped styles won't match and transitions won't work
	* 2. Dynamic CSS variables via v-bind() are used (see line 37)
	*    - v-bind(animationDuration) injects runtime-reactive CSS custom properties
	*    - This allows prop-driven animation timing
	*
	* Reference: https://vuejs.org/guide/built-ins/transition#reusable-transitions
	*/

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
