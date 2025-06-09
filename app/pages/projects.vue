<script lang="ts" setup>
	import Button from 'primevue/button';

	defineI18nRoute({
		paths: {
			de: '/projekte',
			en: '/projects',
		},
	});

	definePageMeta({
		pageTransition: {
			name: 'middleware-controlled',
		},
		middleware: 'page-transition',
	});

	const titleKeyPath = usePageMeta('pages.title.projects');

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	onMounted(() => {
		const { t } = useI18n();

		headerUIStore.setPageTitle(titleKeyPath);

		footerUIStore.rightActionComponent = Button;
		footerUIStore.rightActionProps = {
			label: t('footer.actions.new_project'),
		};
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
</script>

<template>
	<div class="h-full">
		<div class="h-full bg-primary-300 p-4 text-2xl font-bold text-primary-50">
			<NuxtLinkLocale to="index">
				{{ $t('pages.title.login') }}
			</NuxtLinkLocale>
		</div>
	</div>
</template>
