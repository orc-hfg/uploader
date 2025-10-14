<script setup lang="ts">
	import type { ChipItem } from '@/components/elements/LabeledChipList.vue';
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

	const setStore = useSetStore();

	const projectId = useRouteParameter('id');
	const currentProjectId = projectId.value;

	const isContentExpanded = shallowRef<boolean>();
	const showExpandContentButton = shallowRef<boolean>();

	if (!currentProjectId) {
		throw createError({
			statusCode: StatusCodes.NOT_FOUND,
			statusMessage: 'Project not found. The project ID is missing.',
		});
	}

	await callOnce(() => setStore.refresh(currentProjectId, locale.value), { mode: 'navigation' });

	useRouteTitle(() => setStore.setData?.title.value ?? '');

	function toggleContentExpansion(): void {
		isContentExpanded.value = !isContentExpanded.value;
	}

	function handleContentNeedsExpansionStateChange(contentNeedsExpansion: boolean): void {
		showExpandContentButton.value = contentNeedsExpansion;
	}

	useFooterActions();
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
					v-if="setStore.setData?.authors"
					:label="setStore.setData.authors.label"
					:items="setStore.setData.authors.value?.map(author =>
						[author.first_name, author.last_name]
							.filter(Boolean)
							.join(' '),
					) ?? []"
				/>
				<LabeledInputText
					v-if="setStore.setData?.title"
					:label="setStore.setData.title.label"
					:value="setStore.setData.title.value"
				/>
				<LabeledInputText
					v-if="setStore.setData?.subtitle"
					:label="setStore.setData.subtitle.label"
					:value="setStore.setData.subtitle.value"
				/>
				<LabeledInputText
					v-if="setStore.setData?.description"
					:label="setStore.setData.description.label"
					:value="setStore.setData.description.value"
				/>
			</DescriptionList>
			<DescriptionList class="mt-12">
				<LabeledInputText
					v-if="setStore.setData?.titleAlternativeLocale"
					:label="setStore.setData.titleAlternativeLocale.label"
					:value="setStore.setData.titleAlternativeLocale.value"
				/>
				<LabeledInputText
					v-if="setStore.setData?.subtitleAlternativeLocale"
					:label="setStore.setData.subtitleAlternativeLocale.label"
					:value="setStore.setData.subtitleAlternativeLocale.value"
				/>
				<LabeledInputText
					v-if="setStore.setData?.descriptionAlternativeLocale"
					:label="setStore.setData.descriptionAlternativeLocale.label"
					:value="setStore.setData.descriptionAlternativeLocale.value"
				/>
			</DescriptionList>
			<DescriptionList class="mt-12">
				<LabeledInputText
					v-if="setStore.setData?.portrayedObjectDate"
					:label="setStore.setData.portrayedObjectDate.label"
					:value="setStore.setData.portrayedObjectDate.value"
				/>
				<LabeledChipList
					v-if="setStore.setData?.keywords"
					:label="setStore.setData.keywords.label"
					:items="setStore.setData.keywords.value?.map(keyword => keyword.term) ?? []"
				/>
				<LabeledChipList
					v-if="setStore.setData?.semester"
					:label="setStore.setData.semester.label"
					:items="setStore.setData.semester.value?.map(keyword => keyword.term) ?? []"
				/>
				<LabeledChipList
					v-if="setStore.setData?.programOfStudy"
					:label="setStore.setData.programOfStudy.label"
					:items="setStore.setData.programOfStudy.value?.map(keyword => keyword.term) ?? []"
				/>
				<LabeledChipList
					v-if="setStore.setData?.otherCreativeParticipants"
					:label="setStore.setData.otherCreativeParticipants.label"
					:items="setStore.setData.otherCreativeParticipants.value?.map((participant): ChipItem => ({
						label: [participant.person.first_name, participant.person.last_name]
							.filter(Boolean)
							.join(' '),
						secondaryLabel: participant.roleName,
					})) ?? []"
				/>
				<LabeledChipList
					v-if="setStore.setData?.material"
					:label="setStore.setData.material.label"
					:items="setStore.setData.material.value?.map(keyword => keyword.term) ?? []"
				/>
				<LabeledInputText
					v-if="setStore.setData?.dimension"
					:label="setStore.setData.dimension.label"
					:value="setStore.setData.dimension.value"
				/>
				<LabeledInputText
					v-if="setStore.setData?.duration"
					:label="setStore.setData.duration.label"
					:value="setStore.setData.duration.value"
				/>
				<LabeledInputText
					v-if="setStore.setData?.format"
					:label="setStore.setData.format.label"
					:value="setStore.setData.format.value"
				/>
			</DescriptionList>
		</ExpandableContent>
	</div>
</template>
