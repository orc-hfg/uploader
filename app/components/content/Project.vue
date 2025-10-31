<script setup lang="ts">
	import { NuxtLinkLocale } from '#components';
	import Button from 'primevue/button';
	import ResponsiveImage from '@/components/elements/ResponsiveImage.vue';
	import Text from '@/components/elements/Text.vue';

	const { id, title, coverImageSources } = defineProps<{
		id: string;
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
				sizes="(max-width: 520px) 100vw, 520px"
				class="w-[520px]"
			/>
			<Button
				:as="NuxtLinkLocale"
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
