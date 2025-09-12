<script lang="ts" setup>
	import type { MaybeElement } from '@vueuse/core';
	import Logo from '@/components/brand/Logo.vue';
	import Footer from '@/components/layout/Footer.vue';
	import Header from '@/components/layout/Header.vue';

	const appLogger = createAppLogger('Layout: default');

	const route = useRoute();
	const { t } = useI18n();

	const metaTitle = computed(() => {
		const appTitle = t('app.title');

		if (!appTitle?.trim()) {
			return '';
		}

		const { pageTitleKeyPath } = route.meta;

		if (!pageTitleKeyPath) {
			appLogger.warn('[i18n] No pageTitleKeyPath defined for route', route.path);

			return appTitle;
		}

		const pageTitle = t(pageTitleKeyPath);

		if (!pageTitle?.trim()) {
			return appTitle;
		}

		return `${pageTitle} – ${appTitle}`;
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
			<Head>
				<Title>{{ metaTitle }}</Title>
				<Meta name="description" :content="t('meta.description')" />
			</Head>
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

						<main class="grow overflow-y-auto px-10 pt-12">
							<NuxtPage />
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

<style lang="css" scoped>
	.fade-transition-enter-active,
	.fade-transition-leave-active {
		transition: opacity 0.5s;
	}
	.fade-transition-enter-from,
	.fade-transition-leave-to {
		opacity: 0;
	}

	.slide-left-enter-active,
	.slide-left-leave-active,
	.slide-right-enter-active,
	.slide-right-leave-active {
		position: absolute;
		width: 100%;
		animation-duration: 0.5s;
		animation-fill-mode: forwards;
		animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
	}

	.slide-left-enter-active {
		animation-name: slideInFromRight;
	}

	.slide-left-leave-active {
		animation-name: slideOutToRight;
	}

	.slide-right-enter-active {
		animation-name: slideInFromLeft;
	}

	.slide-right-leave-active {
		animation-name: slideOutToLeft;
	}

	@keyframes slideInFromRight {
		from { transform: translateX(100%); }
		to { transform: translateX(0); }
	}

	@keyframes slideOutToRight {
		from { transform: translateX(0); }
		to { transform: translateX(100%); }
	}

	@keyframes slideInFromLeft {
		from { transform: translateX(-100%); }
		to { transform: translateX(0); }
	}

	@keyframes slideOutToLeft {
		from { transform: translateX(0); }
		to { transform: translateX(-100%); }
	}
</style>
