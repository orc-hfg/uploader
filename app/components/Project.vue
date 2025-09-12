<script setup lang="ts">
	import ResponsiveImage from '@/components/ResponsiveImage.vue';

	const { title, coverImageSources } = defineProps<{
		title?: string;
		coverImageSources?: ThumbnailSources;
	}>();
</script>

<template>
	<div>
		<h2 v-if="title" class="text-3xl">
			{{ title }}
		</h2>
		<div class="mt-5">
			<ResponsiveImage
				:image-sources="coverImageSources"
				:alt="$t('pages.projects.image_alt')"
			/>
		</div>
	</div>
</template>
