<script setup lang="ts">
	const { value, emptyPlaceholder = '–' } = defineProps<{
		value?: string;
		emptyPlaceholder?: string;
	}>();

	const displayValue = computed(() => {
		if (value === undefined || value === '') {
			return emptyPlaceholder;
		}

		return value;
	});
</script>

<template>
	{{ displayValue }}
</template>
