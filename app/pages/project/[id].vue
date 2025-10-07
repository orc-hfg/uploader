<script setup lang="ts">
	import { StatusCodes } from 'http-status-codes';
	import ExpandableContent from '@/components/content/ExpandableContent.vue';
	import DescriptionList from '@/components/elements/DescriptionList.vue';
	import LabeledChipList from '@/components/elements/LabeledChipList.vue';
	import LabeledInputText from '@/components/elements/LabeledInputText.vue';

	definePageMeta({
		pageTransition: {
			name: 'middleware-controlled',
		},
		middleware: 'page-transition',
	});

	defineI18nRoute({
		paths: {
			de: '/projekt/[id]',
			en: '/project/[id]',
		},
	});

	const { locale } = useI18n();

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();
	const setStore = useSetStore();

	const projectId = useRouteParameter('id');
	const isContentExpanded = shallowRef<boolean>(false);
	const showExpandContentButton = shallowRef<boolean>(false);

	const currentProjectId = projectId.value;

	if (!currentProjectId) {
		throw createError({
			statusCode: StatusCodes.NOT_FOUND,
			statusMessage: 'Project not found',
		});
	}

	await callOnce(() => setStore.refresh(currentProjectId, locale.value), { mode: 'navigation' });

	function toggleContentExpansion(): void {
		isContentExpanded.value = !isContentExpanded.value;
	}

	function handleContentNeedsExpansionStateChange(contentNeedsExpansion: boolean): void {
		showExpandContentButton.value = contentNeedsExpansion;
	}

	watchEffect(() => {
		const projectTitle = setStore.setData?.title.value;

		if (typeof projectTitle === 'string' && projectTitle.trim().length > 0) {
			headerUIStore.setPageTitle(projectTitle);
		}
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
</script>

<template>
	<div>
		<div
			v-if="showExpandContentButton" class="flex justify-end"
		>
			<Button
				:label="$t('pages.project_id.actions.show_all_data')"
				variant="outlined"
				severity="secondary"
				:aria-expanded="isContentExpanded"
				aria-controls="expandable-content"
				rounded
				@click="toggleContentExpansion"
			>
				<template #icon>
					<i
						class="
        pi pi-angle-down transition-transform duration-(--duration-fast)
        ease-(--ease-smooth)
        motion-reduce:transition-none
      "
						:class="{ 'rotate-180': isContentExpanded }"
					/>
				</template>
			</Button>
		</div>

		<ExpandableContent
			id="expandable-content"
			class="mt-5"
			:is-expanded="isContentExpanded"
			@content-needs-expansion-state-change="handleContentNeedsExpansionStateChange"
		>
			<DescriptionList>
				<LabeledChipList
					:label="setStore.setData?.authors.label"
					:items="setStore.setData?.authors.value?.map(author => `${author.first_name} ${author.last_name}`)"
				/>
				<LabeledInputText
					:label="setStore.setData?.title.label"
					:value="setStore.setData?.title.value"
				/>
				<LabeledInputText
					:label="setStore.setData?.subtitle.label"
					:value="setStore.setData?.subtitle.value"
				/>
				<LabeledInputText
					:label="setStore.setData?.description.label"
					:value="setStore.setData?.description.value"
				/>
			</DescriptionList>
			<DescriptionList class="mt-12">
				<LabeledInputText
					:label="setStore.setData?.titleAlternativeLocale.label"
					:value="setStore.setData?.titleAlternativeLocale.value"
				/>
				<LabeledInputText
					:label="setStore.setData?.subtitleAlternativeLocale.label"
					:value="setStore.setData?.subtitleAlternativeLocale.value"
				/>
				<LabeledInputText
					:label="setStore.setData?.descriptionAlternativeLocale.label"
					:value="setStore.setData?.descriptionAlternativeLocale.value"
				/>
			</DescriptionList>
			<DescriptionList class="mt-12">
				<LabeledInputText
					:label="setStore.setData?.portrayedObjectDate.label"
					:value="setStore.setData?.portrayedObjectDate.value"
				/>
				<LabeledChipList
					:label="setStore.setData?.keywords.label"
					:items="setStore.setData?.keywords.value?.map(keyword => keyword.term)"
				/>
				<LabeledChipList
					:label="setStore.setData?.semester.label"
					:items="setStore.setData?.semester.value?.map(keyword => keyword.term)"
				/>
				<LabeledChipList
					:label="setStore.setData?.programOfStudy.label"
					:items="setStore.setData?.programOfStudy.value?.map(keyword => keyword.term)"
				/>
				<LabeledChipList
					:label="setStore.setData?.material.label"
					:items="setStore.setData?.material.value?.map(keyword => keyword.term)"
				/>
				<LabeledInputText
					:label="setStore.setData?.dimension.label"
					:value="setStore.setData?.dimension.value"
				/>
				<LabeledInputText
					:label="setStore.setData?.duration.label"
					:value="setStore.setData?.duration.value"
				/>
				<LabeledInputText
					:label="setStore.setData?.format.label"
					:value="setStore.setData?.format.value"
				/>
			</DescriptionList>
		</ExpandableContent>
	</div>
</template>
