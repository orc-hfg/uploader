<script setup lang="ts">
	import Fade from '@/components/transitions/Fade.vue';

	/*
	 * We use useSwitchLocalePath() with NuxtLink instead of SwitchLocalePathLink
	 * to avoid hydration mismatches that occur with Nuxt i18n v10 when using baseURL.
	 *
	 * The SwitchLocalePathLink component generates different URLs on server vs client:
	 * - Server: href="/de/anmeldung"
	 * - Client: href="/uploader/de/anmeldung"
	 *
	 * This direct approach ensures consistent URL generation and prevents hydration errors.
	 */
	const switchLocalePath = useSwitchLocalePath();

	const headerUIStore = useHeaderUIStore();
	const { pageTitleTranslation } = storeToRefs(headerUIStore);
</script>

<template>
	<div class="flex h-full items-center justify-between px-4">
		<div>
			<NuxtLink :to="switchLocalePath('de')">
				Deutsch
			</NuxtLink>
		</div>

		<h1 class="text-center text-xl">
			<Fade>
				<span :key="pageTitleTranslation">{{ pageTitleTranslation }}</span>
			</Fade>
		</h1>

		<div>
			<NuxtLink :to="switchLocalePath('en')">
				English
			</NuxtLink>
		</div>
	</div>
</template>
