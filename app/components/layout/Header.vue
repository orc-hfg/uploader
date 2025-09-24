<script setup lang="ts">
	import Text from '@/components/elements/Text.vue';
	import Fade from '@/components/transitions/Fade.vue';

	const headerUIStore = useHeaderUIStore();
	const { pageTitleDisplay } = storeToRefs(headerUIStore);
</script>

<template>
	<div class="flex h-full items-center justify-between px-4">
		<!--
			TODO: Language switchers are temporary for testing purposes.
			This feature will be integrated into a proper menu component in the future.
		-->
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
