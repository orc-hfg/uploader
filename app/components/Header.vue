<script setup lang="ts">
	import Fade from '@/components/transitions/Fade.vue';

	const headerUIStore = useHeaderUIStore();
	const { pageTitleTranslation } = storeToRefs(headerUIStore);
</script>

<template>
	<div class="flex h-full items-center justify-between px-4">
		<div>
			<SwitchLocalePathLink locale="de">
				Deutsch
			</SwitchLocalePathLink>
		</div>

		<h1 class="text-center text-xl">
			<Fade>
				<span :key="pageTitleTranslation">{{ pageTitleTranslation }}</span>
			</Fade>
		</h1>

		<div>
			<SwitchLocalePathLink locale="en">
				English
			</SwitchLocalePathLink>
		</div>
	</div>
</template>
