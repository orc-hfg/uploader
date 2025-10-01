<script setup lang="ts">
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

	await callOnce(() => setStore.refresh(projectId.value!, locale.value), { mode: 'navigation' });

	onMounted(() => {
		const projectTitle = setStore.setData?.title.value;

		headerUIStore.setPageTitle(projectTitle!);
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
</script>

<template>
	<div>
		<p>
			{{ setStore.setData?.title.label }}: {{ setStore.setData?.title.value }}
		</p>

		<p>
			{{ setStore.setData?.subtitle.label }}: {{ setStore.setData?.subtitle.value }}
		</p>

		<p>
			{{ setStore.setData?.description.label }}: {{ setStore.setData?.description.value }}
		</p>

		<Button :label="$t('pages.project_id.actions.show_all_data')" severity="secondary" variant="outlined" rounded icon="pi pi-angle-down" />

		<div class="mt-5">
			<NuxtLinkLocale to="index">
				Link: {{ $t('pages.sign_in.title') }}
			</NuxtLinkLocale>
		</div>

		<div class="mt-5">
			<NuxtLinkLocale to="projects">
				Link: {{ $t('pages.projects.title') }}
			</NuxtLinkLocale>
		</div>
	</div>
</template>
