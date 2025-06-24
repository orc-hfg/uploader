<script lang="ts" setup>
	import Button from 'primevue/button';

	const PAGE_TITLE_KEY_PATH = 'pages.title.projects';

	definePageMeta({
		pageTitleKeyPath: PAGE_TITLE_KEY_PATH,
		pageTransition: {
			name: 'middleware-controlled',
		},
		middleware: 'page-transition',
	});

	defineI18nRoute({
		paths: {
			de: '/projekte',
			en: '/projects',
		},
	});

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	const { t } = useI18n();

	onMounted(() => {
		headerUIStore.setPageTitleKeyPath(PAGE_TITLE_KEY_PATH);

		footerUIStore.rightActionComponent = Button;
		footerUIStore.rightActionProps = {
			label: t('footer.actions.new_project'),
			icon: 'pi pi-plus',
			type: 'button',
		};
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
</script>

<template>
	<div>
		<NuxtLinkLocale to="index">
			Link: {{ t('pages.title.login') }}
		</NuxtLinkLocale>
	</div>
</template>
