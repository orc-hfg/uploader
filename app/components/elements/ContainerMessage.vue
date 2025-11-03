<script setup lang="ts">
	import Text from '@/components/elements/Text.vue';

	const { message, containerStyles, isRounded } = defineProps<{
		message: string;
		containerStyles?: Record<string, string>;
		isRounded?: boolean;
	}>();
</script>

<template>
	<div
		class="
    flex aspect-3/2 items-center justify-center bg-surface-100 p-4 text-center
    text-surface-400
  "
		:class="{ 'rounded-2xl': isRounded }"
		:style="containerStyles"
	>
		<Text as="p" variant="display-small">
			{{ message }}
		</Text>
	</div>
</template>
