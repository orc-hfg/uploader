<script setup lang="ts">
	import Button from 'primevue/button';
	import ResponsiveImage from '@/components/elements/ResponsiveImage.vue';
	import Text from '@/components/elements/Text.vue';

	const { id, title, coverImageSources } = defineProps<{
		id: string;
		title?: string;
		coverImageSources?: ThumbnailSources;
	}>();

	// When imported via #components, knip would mark it as an unresolved import
	// See: https://nuxt.com/docs/4.x/guide/directory-structure/app/components#dynamic-components
	const NuxtLinkLocaleComponent = resolveComponent('NuxtLinkLocale');
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
				class="w-[520px]"
			/>
			<Button
				:as="NuxtLinkLocaleComponent"
				:to="{ name: 'project-id', params: { id } }"
				icon="pi pi-arrow-right"
				:label="$t('components.project.open')"
				severity="contrast"
				rounded
				class="absolute right-5 bottom-5"
			/>
		</div>
	</div>
</template>
