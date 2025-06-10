<script setup lang="ts">
	interface Props {
		duration?: number;
	}

	const props = withDefaults(defineProps<Props>(), {
		duration: 0.5,
	});

	const animationDuration = `${props.duration}s`;
</script>

<template>
	<Transition name="fade" mode="out-in">
		<slot />
	</Transition>
</template>

<!-- eslint-disable vue/enforce-style-attribute -->
<!-- Note: avoid using <style scoped> here since it does not apply to slot content. -->
<!-- https://vuejs.org/guide/built-ins/transition#reusable-transitions -->
<style lang="css">
	.fade-enter-active,
	.fade-leave-active {
		animation-duration: v-bind(animationDuration);
		animation-fill-mode: forwards;
		animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
	}

	.fade-enter-active {
		animation-name: fadeIn;
	}

	.fade-leave-active {
		animation-name: fadeOut;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes fadeOut {
		from { opacity: 1; }
		to { opacity: 0; }
	}
</style>
