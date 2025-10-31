<script setup lang="ts">
	import BlockUI from 'primevue/blockui';
	import Button from 'primevue/button';
	import Column from 'primevue/column';
	import DataTable from 'primevue/datatable';
	import ProgressSpinner from 'primevue/progressspinner';
	import ResponsiveImage from '@/components/elements/ResponsiveImage.vue';
	import Text from '@/components/elements/Text.vue';
	import Value from '@/components/elements/Value.vue';

	const { mediaEntries = [], isReordering } = defineProps<{
		mediaEntries?: {
			mediaEntryId: string;
			title: string;
			thumbnailSources: ThumbnailSources;
		}[];
		isReordering?: boolean;
	}>();

	const emit = defineEmits<{
		reorder: [mediaEntryIds: string[]];
	}>();

	const appLogger = createAppLogger('Component: MediaEntries');

	const THUMBNAIL_CONFIG = {
		width: 85,
		height: 57,
	} as const;

	/*
	 * Z-Index must be higher than PrimeVue BlockUI mask (1101)
	 * to ensure spinner appears above the overlay
	 */
	const SPINNER_Z_INDEX = 1102;

	const entries = shallowRef([...mediaEntries]);

	/*
	 * Watch for prop changes and update local state
	 * Guard prevents updates during reordering to avoid overwriting user's drag-and-drop action
	 */
	watch(() => mediaEntries, (newEntries) => {
		if (!isReordering) {
			entries.value = [...newEntries];
		}
	});

	function onRowReorder(event: { value: typeof mediaEntries }) {
		entries.value = event.value;

		const orderedIds = event.value.map(entry => entry.mediaEntryId);
		emit('reorder', orderedIds);
	}

	/*
	 * TODO: Implement edit functionality as direct link navigation
	 * Implementation approach:
	 * 1. Add projectId as required prop
	 * 2. Replace Button with Button using :as="NuxtLinkLocale" and :to
	 * 3. Dynamically compose route path with projectId and mediaEntryId
	 * Example in template:
	 *   <Button
	 *     :as="NuxtLinkLocale"
	 *     :to="`/project/${projectId}/media-entry/${data.mediaEntryId}/edit`"
	 *     ...
	 *   />
	 * This approach follows KISS principle and provides better UX (real link with browser features)
	 */
	function onEdit(mediaEntryId: string) {
		appLogger.info('Edit media entry:', { mediaEntryId });
	}
</script>

<template>
	<div class="relative">
		<BlockUI
			:blocked="isReordering"
			:pt="{
				mask: { class: 'rounded-2xl' },
			}"
		>
			<div
				class="
      rounded-2xl bg-surface-100 p-4
      [&_tbody>tr:last-child>td]:border-b-0
    "
			>
				<DataTable
					v-model:value="entries"
					reorderable-rows
					:pt="{
						table: { role: undefined },
						thead: { class: 'hidden', role: undefined },
						tbody: { role: undefined },
						headerRow: { role: undefined },
						bodyRow: { role: undefined, class: 'bg-transparent' },
					}"
					@row-reorder="onRowReorder"
				>
					<Column
						row-reorder
						header=""
						:pt="{
							headerCell: { scope: 'col', role: undefined },
							bodyCell: { role: undefined, class: 'border-b border-surface-300 w-12' },
						}"
					/>
					<Column
						field="thumbnailSources"
						header=""
						:pt="{
							headerCell: { scope: 'col', role: undefined },
							bodyCell: { role: undefined, class: 'border-b border-surface-300 w-[105px]' },
						}"
					>
						<template #body="{ data }">
							<ResponsiveImage
								:image-sources="data.thumbnailSources"
								:alt="data.title"
								:sizes="`${THUMBNAIL_CONFIG.width}px`"
								:fixed-width="THUMBNAIL_CONFIG.width"
								:fixed-height="THUMBNAIL_CONFIG.height"
								class="rounded-sm"
							/>
						</template>
					</Column>
					<Column
						field="title"
						header=""
						:pt="{
							headerCell: { scope: 'col', role: undefined },
							bodyCell: { role: undefined, class: 'border-b border-surface-300' },
						}"
					>
						<template #body="{ data }">
							<Text as="p" variant="body-medium">
								<Value :value="data.title" />
							</Text>
						</template>
					</Column>
					<Column
						field="action"
						header=""
						:pt="{
							headerCell: { scope: 'col', role: undefined },
							bodyCell: { role: undefined, class: 'border-b border-surface-300 text-right' },
						}"
					>
						<template #body="{ data }">
							<Button
								variant="outlined"
								severity="secondary"
								rounded
								icon="pi pi-pencil"
								:aria-label="$t('components.media_entries.edit_media_entry_aria_label')"
								@click="() => onEdit(data.mediaEntryId)"
							/>
						</template>
					</Column>
				</DataTable>
			</div>
		</BlockUI>
		<div
			v-if="isReordering"
			:class="`
     absolute inset-0
     z-${SPINNER_Z_INDEX}
     flex items-center justify-center
   `"
		>
			<ProgressSpinner :aria-label="$t('components.media_entries.reordering_aria_label')" />
		</div>
	</div>
</template>
