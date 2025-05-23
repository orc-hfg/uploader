<script lang="ts" setup>
	import type { MaybeElement } from '@vueuse/core';
	import Logo from '@/components/brand/Logo.vue';

	const logoContainerReference = useTemplateRef<MaybeElement>('logoContainerReference');
	const overlayReference = useTemplateRef<MaybeElement>('overlayReference');
	const mainReference = useTemplateRef<MaybeElement>('mainReference');

	const BLUR_TARGET = 20;
	const OPACITY_TARGET = 0.5;

	const LOGO_DELAY = 500;
	const LOGO_DURATION = 300;
	const OVERLAY_DURATION = 500;
	const MAIN_DURATION = 300;

	const OVERLAY_START_PERCENTAGE = 0.5;
	const OVERLAY_DELAY = LOGO_DELAY + (LOGO_DURATION * OVERLAY_START_PERCENTAGE);

	function startAnimationSequence() {
		animateLogo();

		setTimeout(animateOverlay, OVERLAY_DELAY);
	}

	function animateLogo() {
		useAnimate(
			logoContainerReference,
			[
				{ filter: `blur(${BLUR_TARGET}px)` },
			],
			{
				duration: LOGO_DURATION,
				delay: LOGO_DELAY,
				easing: 'ease-out',
				fill: 'forwards',
			},
		);
	}

	function animateOverlay() {
		useAnimate(
			overlayReference,
			[
				{ opacity: OPACITY_TARGET },
			],
			{
				duration: OVERLAY_DURATION,
				easing: 'ease-out',
				fill: 'forwards',
				onReady: (animation) => {
					animation.onfinish = animateMain;
				},
			},
		);
	}

	function animateMain() {
		useAnimate(
			mainReference,
			[
				{ opacity: 1 },
			],
			{
				duration: MAIN_DURATION,
				easing: 'ease-out',
				fill: 'forwards',
			},
		);
	}

	startAnimationSequence();
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
