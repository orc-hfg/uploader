<script setup lang="ts">
	const { message } = defineProps<{
		message: string;
	}>();
</script>

<template>
	<p class="mt-40 text-center text-4xl font-medium text-surface-400">
		{{ message }}
	</p>
</template>
