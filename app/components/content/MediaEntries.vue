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

	const entries = shallowRef([...mediaEntries]);

	watch(() => mediaEntries, (newEntries) => {
		entries.value = [...newEntries];
	});

	function onRowReorder(event: { value: typeof mediaEntries }) {
		entries.value = event.value;

		const orderedIds = event.value.map(entry => entry.mediaEntryId);
		emit('reorder', orderedIds);
	}

	function onEdit(mediaEntryId: string) {
		appLogger.info('Edit media entry:', { mediaEntryId });
	}
</script>

<template>
	<div class="relative">
		<BlockUI
			:blocked="isReordering"
			:pt="{
				mask: { class: 'rounded-2xl media-entries-mask' },
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
								sizes="85px"
								:fixed-width="85"
								:fixed-height="57"
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
							bodyCell: { role: undefined, class: 'border-b border-surface-300' },
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
			class="
     media-entries-spinner absolute inset-0 flex items-center justify-center
   "
		>
			<ProgressSpinner :aria-label="$t('components.media_entries.reordering_aria_label')" />
		</div>
	</div>
</template>

<!--
	Custom style block is required to override PrimeVue BlockUI mask opacity.
	- PrimeVue sets inline styles that cannot be overridden with Tailwind utility classes
	- :deep() selector is needed to penetrate Vue scoped styles and reach dynamically generated PrimeVue elements
	- !important is necessary to override PrimeVue's inline styles
	- Spinner is positioned outside BlockUI and uses higher z-index (1101) to appear above mask (1100)
-->
<!-- eslint-disable-next-line -->
<style scoped>
	:deep(.media-entries-mask) {
		background-color: rgba(0, 0, 0, 0.1) !important;
	}

	.media-entries-spinner {
		z-index: 1101;
	}
</style>
