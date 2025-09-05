<script setup lang="ts">
	const { title } = defineProps<{
		title?: string;
	}>();
</script>

<template>
	<div>
		<h2 class="text-3xl">
			{{ title }}
		</h2>
		<div class="mt-5">
			<img src="https://picsum.photos/520/347" alt="Set Image">
		</div>
	</div>
</template>
