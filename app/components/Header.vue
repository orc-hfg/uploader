<script setup lang="ts">
	import { useHeaderUIStore } from '@/stores/header-ui';
	import { storeToRefs } from 'pinia';
	import Fade from './transitions/Fade.vue';

	const headerUIStore = useHeaderUIStore();
	const { title } = storeToRefs(headerUIStore);
</script>

<template>
	<div class="flex items-center justify-between h-full px-4">
		<div class="w-10">
			Left
		</div>

		<h1 class="text-xl text-center">
			<Fade>
				<span :key="title">{{ title }}</span>
			</Fade>
		</h1>

		<div class="w-10 text-right">
			Right
		</div>
	</div>
</template>
