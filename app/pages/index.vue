<script lang="ts" setup>
	import type { MaybeElement } from '@vueuse/core';
	import Logo from '@/components/brand/Logo.vue';

	const metaTitle = useMetaTitle('Login');

	useHead({
		title: metaTitle,
	});

	const logoContainerReference = useTemplateRef<MaybeElement>('logoContainerReference');
	const overlayReference = useTemplateRef<MaybeElement>('overlayReference');

	const BLUR_TARGET = 20;
	const OPACITY_TARGET = 0.5;

	function animateOverlay() {
		useAnimate(
			overlayReference,
			[
				{ opacity: OPACITY_TARGET },
			],
			{
				duration: 1000,
				easing: 'ease-out',
				fill: 'forwards',
			},
		);
	}

	function animateBlur() {
		useAnimate(
			logoContainerReference,
			[
				{ filter: `blur(${BLUR_TARGET}px)` },
			],
			{
				duration: 500,
				delay: 500,
				easing: 'ease-out',
				fill: 'forwards',
				onReady: (animation) => {
					animation.onfinish = animateOverlay;
				},
			},
		);
	}

	animateBlur();
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
		</div>
	</div>
</template>
