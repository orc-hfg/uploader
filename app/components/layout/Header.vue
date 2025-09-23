<script setup lang="ts">
	import Text from '@/components/elements/Text.vue';
	import Fade from '@/components/transitions/Fade.vue';

	/**
	 * We use SwitchLocalePathLink wrapped in ClientOnly to avoid hydration mismatches
	 * that occur with Nuxt i18n v10 when using baseURL.
	 *
	 * The SwitchLocalePathLink component generates different URLs on server vs client:
	 * - Server: href="/de/anmeldung"
	 * - Client: href="/uploader/de/anmeldung"
	 *
	 * Additionally, router active states differ between SSR and client hydration.
	 * The ClientOnly wrapper ensures consistent rendering and eliminates hydration mismatches.
	 */

	const headerUIStore = useHeaderUIStore();
	const { pageTitleDisplay } = storeToRefs(headerUIStore);
</script>

<template>
	<div class="flex h-full items-center justify-between px-4">
		<div>
			<ClientOnly>
				<SwitchLocalePathLink locale="de">
					Deutsch
				</SwitchLocalePathLink>
			</ClientOnly>
		</div>

		<Text as="h1" variant="headline-small" class="truncate px-4 text-center">
			<Fade>
				<span :key="pageTitleDisplay">{{ pageTitleDisplay }}</span>
			</Fade>
		</Text>

		<div>
			<ClientOnly>
				<SwitchLocalePathLink locale="en">
					English
				</SwitchLocalePathLink>
			</ClientOnly>
		</div>
	</div>
</template>
