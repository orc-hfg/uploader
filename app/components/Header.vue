<script setup lang="ts">
	import { useHeaderUIStore } from '@/stores/header-ui';
	import { storeToRefs } from 'pinia';
	import Fade from './transitions/Fade.vue';

	const headerUIStore = useHeaderUIStore();
	const { title } = storeToRefs(headerUIStore);
</script>

<template>
	<div class="flex h-full items-center justify-between px-4">
		<div class="w-10">
			Left
		</div>

		<h1 class="text-center text-xl">
			<Fade>
				<span :key="title">{{ title }}</span>
			</Fade>
		</h1>

		<div class="w-10 text-right">
			Right
		</div>
	</div>
</template>
