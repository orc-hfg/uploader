<script setup lang="ts">
	import Button from 'primevue/button';
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
		<div class="relative mt-5">
			<ResponsiveImage
				:image-sources="coverImageSources"
				:alt="$t('pages.projects.image_alt')"
			/>
			<Button
				as="a"
				href="https://vuejs.org/"
				icon="pi pi-arrow-right"
				:label="$t('components.project.open')"
				severity="contrast"
				rounded
				class="absolute right-5 bottom-5"
			/>
		</div>
	</div>
</template>
