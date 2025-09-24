<script setup lang="ts">
	import Content from '@/components/layout/Content.vue';

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

	const projectId = useRouteParameter('id');

	const headerUIStore = useHeaderUIStore();
	const setsStore = useSetsStore();

	const { locale } = useI18n();

	await callOnce(() => setsStore.refresh(locale.value), { mode: 'navigation' });

	onMounted(() => {
		headerUIStore.setPageTitle(setsStore.getSetTitleById(projectId.value) ?? '');
	});
</script>

<template>
	<Content>
		{{ projectId }}
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
	</Content>
</template>
