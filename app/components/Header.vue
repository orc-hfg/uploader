<script setup lang="ts">
	import Fade from './transitions/Fade.vue';

	const headerUIStore = useHeaderUIStore();
	const { titleTranslationMessage } = storeToRefs(headerUIStore);
</script>

<template>
	<div class="flex h-full items-center justify-between px-4">
		<div class="w-10">
			Left
		</div>

		<h1 class="text-center text-xl">
			<Fade>
				<span :key="titleTranslationMessage">{{ titleTranslationMessage }}</span>
			</Fade>
		</h1>

		<div class="w-10 text-right">
			Right
		</div>
	</div>
</template>
