<script setup lang="ts">
	import ResponsiveImage from '@/components/elements/ResponsiveImage.vue';
	import Text from '@/components/elements/Text.vue';

	const { title, coverImageSources } = defineProps<{
		title?: string;
		coverImageSources?: ThumbnailSources;
	}>();
</script>

<template>
	<div>
		<Text v-if="title" as="h2" variant="headline-medium">
			{{ title }}
		</Text>
		<div class="mt-5">
			<ResponsiveImage
				:image-sources="coverImageSources"
				:alt="$t('pages.projects.image_alt')"
			/>
		</div>
	</div>
</template>
