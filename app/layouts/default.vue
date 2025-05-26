<script lang="ts" setup>
	import type { MaybeElement } from '@vueuse/core';
	import Logo from '@/components/brand/Logo.vue';

	const logoContainerReference = useTemplateRef<MaybeElement>('logoContainerReference');
	const overlayReference = useTemplateRef<MaybeElement>('overlayReference');
	const mainReference = useTemplateRef<MaybeElement>('mainReference');

	const LOGO_CONTAINER_BLUR_TARGET = 20;
	const OVERLAY_OPACITY_TARGET = 0.5;
	const MAIN_OPACITY_TARGET = 1;

	const LOGO_CONTAINER_DELAY = 300;
	const LOGO_CONTAINER_DURATION = 300;
	const OVERLAY_DURATION = 500;
	const MAIN_DURATION = 300;

	const OVERLAY_START_PERCENTAGE = 0.1;
	const OVERLAY_DELAY = LOGO_CONTAINER_DELAY + (LOGO_CONTAINER_DURATION * OVERLAY_START_PERCENTAGE);

	function setupAnimations() {
		const logoAnimation = useAnimate(
			logoContainerReference.value,
			[
				{ filter: `blur(${LOGO_CONTAINER_BLUR_TARGET}px)` },
			],
			{
				duration: LOGO_CONTAINER_DURATION,
				delay: LOGO_CONTAINER_DELAY,
				easing: 'ease-in',
				fill: 'forwards',
				immediate: false,
			},
		);

		const overlayAnimation = useAnimate(
			overlayReference.value,
			[
				{ opacity: OVERLAY_OPACITY_TARGET },
			],
			{
				duration: OVERLAY_DURATION,
				easing: 'ease-in',
				fill: 'forwards',
				immediate: false,
			},
		);

		const mainAnimation = useAnimate(
			mainReference.value,
			[
				{ opacity: MAIN_OPACITY_TARGET },
			],
			{
				duration: MAIN_DURATION,
				easing: 'ease-in',
				fill: 'forwards',
				immediate: false,
			},
		);

		return { logoAnimation, overlayAnimation, mainAnimation };
	}

	async function startSequence() {
		const { logoAnimation, overlayAnimation, mainAnimation } = setupAnimations();

		logoAnimation.play();

		await new Promise(resolve => setTimeout(resolve, OVERLAY_DELAY));
		overlayAnimation.play();

		await new Promise(resolve => setTimeout(resolve, OVERLAY_DURATION));
		mainAnimation.play();
	}

	onMounted(() => {
		startSequence();
	});
</script>

<template>
	<div>
		<div
			ref="overlayReference"
			class="overlay fixed inset-0 opacity-0 z-1 bg-surface-300"
		/>
		<div class="grid place-items-center h-screen">
			<div ref="logoContainerReference">
				<Logo />
			</div>

			<main ref="mainReference" class="w-[600px] h-[800px] overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed z-2 bg-surface-0 opacity-0">
				<slot />
			</main>
		</div>
	</div>
</template>
