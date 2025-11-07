<script lang="ts" setup>
	import type { MaybeElement } from '@vueuse/core';
	import Logo from '@/components/brand/Logo.vue';
	import Content from '@/components/layout/Content.vue';
	import Footer from '@/components/layout/Footer.vue';
	import Header from '@/components/layout/Header.vue';

	const { t } = useI18n();
	const route = useRoute();
	const config = useRuntimeConfig();

	const metaTitle = computed(() => {
		const appTitle = t('app.title');

		if (!appTitle?.trim()) {
			return '';
		}

		const { pageTitle } = route.meta;

		if (!pageTitle?.trim()) {
			return appTitle;
		}

		return `${pageTitle} – ${appTitle}`;
	});

	useHead({
		title: metaTitle,
		meta: [
			{
				name: 'description',
				content: t('meta.description'),
			},
		],
		link: [
			{
				rel: 'icon',
				type: 'image/png',
				href: `${config.app.baseURL}favicon-96x96.png`,
				sizes: '96x96',
			},
			{
				rel: 'icon',
				type: 'image/svg+xml',
				href: `${config.app.baseURL}favicon.svg`,
			},
			{
				rel: 'shortcut icon',
				href: `${config.app.baseURL}favicon.ico`,
			},
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: `${config.app.baseURL}apple-touch-icon.png`,
			},
			{
				rel: 'manifest',
				href: `${config.app.baseURL}site.webmanifest`,
			},
		],
	});

	const logoReference = useTemplateRef<MaybeElement>('logoReference');
	const overlayReference = useTemplateRef<MaybeElement>('overlayReference');
	const contentReference = useTemplateRef<MaybeElement>('contentReference');

	const LOGO_BLUR_TARGET = 20;
	const OVERLAY_OPACITY_TARGET = 0.5;
	const CONTENT_OPACITY_TARGET = 1;

	const LOGO_DELAY = 300;
	const LOGO_DURATION = 300;
	const OVERLAY_DURATION = 500;
	const CONTENT_DURATION = 300;

	const OVERLAY_START_PERCENTAGE = 0.1;
	const OVERLAY_DELAY = LOGO_DELAY + (LOGO_DURATION * OVERLAY_START_PERCENTAGE);

	function setupAnimations() {
		const logoAnimation = useAnimate(
			logoReference.value,
			[{ filter: `blur(${LOGO_BLUR_TARGET}px)` }],
			{
				duration: LOGO_DURATION,
				delay: LOGO_DELAY,
				easing: 'ease-in',
				fill: 'forwards',
				immediate: false,
			},
		);

		const overlayAnimation = useAnimate(
			overlayReference.value,
			[{ opacity: OVERLAY_OPACITY_TARGET }],
			{
				duration: OVERLAY_DURATION,
				easing: 'ease-in',
				fill: 'forwards',
				immediate: false,
			},
		);

		const contentAnimation = useAnimate(
			contentReference.value,
			[{ opacity: CONTENT_OPACITY_TARGET }],
			{
				duration: CONTENT_DURATION,
				easing: 'ease-in',
				fill: 'forwards',
				immediate: false,
			},
		);

		return { logoAnimation, overlayAnimation, contentAnimation };
	}

	async function startSequence() {
		const { logoAnimation, overlayAnimation, contentAnimation } = setupAnimations();

		logoAnimation.play();

		await new Promise((resolve) => {
			setTimeout(resolve, OVERLAY_DELAY);
		});
		overlayAnimation.play();

		await new Promise((resolve) => {
			setTimeout(resolve, OVERLAY_DURATION);
		});
		contentAnimation.play();
	}

	onMounted(() => {
		startSequence();
	});
</script>

<template>
	<div>
		<Html>
			<Body>
				<div>
					<div
						ref="contentReference"
						data-testid="content"
						class="
        absolute top-1/2 left-1/2 z-2 flex size-full -translate-1/2 flex-col
        overflow-hidden bg-surface-0 opacity-0
        sm:h-[800px] sm:w-[600px]
      "
					>
						<header class="min-h-[75px]">
							<Header />
						</header>

						<main class="grow overflow-y-auto pt-12" tabindex="0">
							<Content>
								<slot name="main">
									<NuxtPage />
								</slot>
							</Content>
						</main>

						<footer
							class="
         absolute bottom-0 h-[75px] w-full px-4
         sm:w-[600px]
       "
						>
							<Footer />
						</footer>
					</div>
				</div>
				<div
					ref="overlayReference"
					class="overlay fixed inset-0 z-1 bg-surface-300 opacity-0"
				/>
				<div ref="logoReference" class="grid h-screen place-items-center p-24">
					<Logo class="h-auto w-full max-w-5xl" />
				</div>
			</Body>
		</Html>
	</div>
</template>

<!--
	This style block is necessary despite the project's preference for Tailwind-only styling because:

	1. Vue's <Transition> component requires CSS classes with specific lifecycle suffixes
	(-enter-active, -enter-from, -enter-to, -leave-active, -leave-from, -leave-to)

	2. Tailwind cannot dynamically generate these Vue-specific transition classes

	3. CSS custom properties (--duration-fast, --ease-smooth) provide centralized timing values
-->
<!-- eslint-disable-next-line vue/no-restricted-block -->
<style scoped>
	/* General page content transitions */

	/* Fade transition (reduce motion or forced fallback) */
	.fade-transition-enter-active,
	.fade-transition-leave-active {
		transition: opacity var(--duration-fast);
	}
	.fade-transition-enter-from,
	.fade-transition-leave-to {
		opacity: 0;
	}

	/*
	* Slide transitions
	* Note: Left/right slide animations can occasionally exhibit buggy behavior
	* where pages slide in the wrong direction. The root cause is unclear.
	* If issues persist, consider enabling the fade transition fallback by setting
	* enableFadeTransitionFallback to true in nuxt.config.ts
	*/
	.slide-left-enter-active,
	.slide-left-leave-active,
	.slide-right-enter-active,
	.slide-right-leave-active {
		position: absolute;
		width: 100%;
		transition:
			transform var(--duration-fast) var(--ease-smooth),
			opacity var(--duration-fast) var(--ease-smooth);
	}

	/* Slide left transition (forward navigation) */
	.slide-left-enter-from {
		transform: translateX(100%);
		opacity: 0;
	}

	.slide-left-enter-to {
		transform: translateX(0);
		opacity: 1;
	}

	.slide-left-leave-from {
		transform: translateX(0);
		opacity: 1;
	}

	.slide-left-leave-to {
		transform: translateX(-100%);
		opacity: 0;
	}

	/* Slide right transition (backward navigation) */
	.slide-right-enter-from {
		transform: translateX(-100%);
		opacity: 0;
	}

	.slide-right-enter-to {
		transform: translateX(0);
		opacity: 1;
	}

	.slide-right-leave-from {
		transform: translateX(0);
		opacity: 1;
	}

	.slide-right-leave-to {
		transform: translateX(100%);
		opacity: 0;
	}
</style>
