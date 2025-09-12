<script setup lang="ts">
	const { imageSources, alt } = defineProps<{
		imageSources?: ThumbnailSources;
		alt: string;
	}>();

	const sourceSet = computed(() => {
		if (!imageSources) {
			return '';
		}

		const sources: string[] = [];
		for (const imageSource of Object.values(imageSources).filter(Boolean)) {
			const { url, width } = imageSource;

			if (url && typeof width === 'number') {
				sources.push(`${url} ${width}w`);
			}
		}

		return sources.join(', ');
	});

	const fallbackSource = computed(() => {
		if (!imageSources) {
			return '';
		}

		const preferredSizes: (keyof ThumbnailSources)[] = ['large', 'medium', 'small'];
		for (const preferredSize of preferredSizes) {
			if (imageSources[preferredSize]?.url) {
				return imageSources[preferredSize].url;
			}
		}

		return '';
	});

	// Default sizes definition for responsive images (adjust if needed)
	const sizes = '(max-width: 520px) 100vw, 520px';
</script>

<template>
	<img
		v-if="fallbackSource"
		:src="fallbackSource"
		:srcset="sourceSet"
		:sizes="sizes"
		:alt="alt"
		loading="lazy"
	>
	<div
		v-else class="
    flex h-87 items-center justify-center bg-slate-100 text-4xl font-medium
    text-surface-400
  "
	>
		{{ $t('components.responsive_image.not_available') }}
	</div>
</template>
