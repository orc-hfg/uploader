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

	await callOnce(`set-${currentProjectId}-${locale.value}`, () => setStore.refresh(currentProjectId, locale.value), { mode: 'navigation' });

	useRouteTitle(() => setStore.setDisplayData?.title.value ?? '');

	function toggleContentExpansion(): void {
		isContentExpanded.value = !isContentExpanded.value;
	}

	function handleContentNeedsExpansionStateChange(contentNeedsExpansion: boolean): void {
		showExpandContentButton.value = contentNeedsExpansion;
	}

	function extractTerms(items: Array<{ term: string }> | undefined): string[] {
		return items?.map(item => item.term) ?? [];
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
					v-if="setStore.setDisplayData?.authors"
					:label="setStore.setDisplayData.authors.label"
					:items="setStore.setDisplayData.authors.value?.map(author =>
						[author.first_name, author.last_name]
							.filter(Boolean)
							.join(' '),
					) ?? []"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.title"
					:label="setStore.setDisplayData.title.label"
					:value="setStore.setDisplayData.title.value"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.subtitle"
					:label="setStore.setDisplayData.subtitle.label"
					:value="setStore.setDisplayData.subtitle.value"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.description"
					:label="setStore.setDisplayData.description.label"
					:value="setStore.setDisplayData.description.value"
				/>
			</DescriptionList>
			<DescriptionList class="mt-12">
				<LabeledInputText
					v-if="setStore.setDisplayData?.titleAlternativeLocale"
					:label="setStore.setDisplayData.titleAlternativeLocale.label"
					:value="setStore.setDisplayData.titleAlternativeLocale.value"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.subtitleAlternativeLocale"
					:label="setStore.setDisplayData.subtitleAlternativeLocale.label"
					:value="setStore.setDisplayData.subtitleAlternativeLocale.value"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.descriptionAlternativeLocale"
					:label="setStore.setDisplayData.descriptionAlternativeLocale.label"
					:value="setStore.setDisplayData.descriptionAlternativeLocale.value"
				/>
			</DescriptionList>
			<DescriptionList class="mt-12">
				<LabeledInputText
					v-if="setStore.setDisplayData?.portrayedObjectDate"
					:label="setStore.setDisplayData.portrayedObjectDate.label"
					:value="setStore.setDisplayData.portrayedObjectDate.value"
				/>
				<LabeledChipList
					v-if="setStore.setDisplayData?.projectCategory"
					:label="setStore.setDisplayData.projectCategory.label"
					:items="extractTerms(setStore.setDisplayData.projectCategory.value)"
				/>
				<LabeledChipList
					v-if="setStore.setDisplayData?.keywords"
					:label="setStore.setDisplayData.keywords.label"
					:items="extractTerms(setStore.setDisplayData.keywords.value)"
				/>
				<LabeledChipList
					v-if="setStore.setDisplayData?.semester"
					:label="setStore.setDisplayData.semester.label"
					:items="extractTerms(setStore.setDisplayData.semester.value)"
				/>
				<LabeledChipList
					v-if="setStore.setDisplayData?.programOfStudy"
					:label="setStore.setDisplayData.programOfStudy.label"
					:items="extractTerms(setStore.setDisplayData.programOfStudy.value)"
				/>
				<LabeledChipList
					v-if="setStore.setDisplayData?.otherCreativeParticipants"
					:label="setStore.setDisplayData.otherCreativeParticipants.label"
					:items="setStore.setDisplayData.otherCreativeParticipants.value?.map((participant): ChipItem => ({
						label: [participant.person.first_name, participant.person.last_name]
							.filter(Boolean)
							.join(' '),
						secondaryLabel: participant.roleName,
					})) ?? []"
				/>
				<LabeledChipList
					v-if="setStore.setDisplayData?.material"
					:label="setStore.setDisplayData.material.label"
					:items="extractTerms(setStore.setDisplayData.material.value)"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.dimension"
					:label="setStore.setDisplayData.dimension.label"
					:value="setStore.setDisplayData.dimension.value"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.duration"
					:label="setStore.setDisplayData.duration.label"
					:value="setStore.setDisplayData.duration.value"
				/>
				<LabeledInputText
					v-if="setStore.setDisplayData?.format"
					:label="setStore.setDisplayData.format.label"
					:value="setStore.setDisplayData.format.value"
				/>
			</DescriptionList>
		</ExpandableContent>
	</div>
</template>
