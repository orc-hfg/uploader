<script setup lang="ts">
	import Text from '@/components/elements/Text.vue';

	const { message } = defineProps<{
		message: string;
	}>();
</script>

<template>
	<Text as="p" variant="display-small" class="mt-40 text-center text-surface-400">
		{{ message }}
	</Text>
</template>
