<script setup lang="ts">
	import Text from '@/components/elements/Text.vue';

	const { imageSources, alt, sizes, fixedWidth, fixedHeight } = defineProps<{
		imageSources?: ThumbnailSources;
		alt: string;
		sizes: string;
		fixedWidth?: number;
		fixedHeight?: number;
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

	const imageStyles = computed(() => {
		const styles: Record<string, string> = {};

		if (fixedWidth) {
			styles.width = `${fixedWidth}px`;
		}

		if (fixedHeight) {
			styles.height = `${fixedHeight}px`;
		}

		if (fixedWidth || fixedHeight) {
			styles.objectFit = 'cover';
		}

		return styles;
	});
</script>

<template>
	<img
		v-if="fallbackSource"
		:src="fallbackSource"
		:srcset="sourceSet"
		:sizes="sizes"
		:alt="alt"
		:style="imageStyles"
		loading="lazy"
	>
	<div
		v-else class="
    flex h-87 items-center justify-center bg-surface-100 text-surface-400
  "
	>
		<Text
			as="p" variant="display-small"
		>
			{{ $t('components.responsive_image.not_available') }}
		</Text>
	</div>
</template>
