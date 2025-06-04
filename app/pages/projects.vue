<script lang="ts" setup>
	import Button from 'primevue/button';

	definePageMeta({
		pageTransition: {
			name: 'slide-left',
		},
		middleware: 'page-transition',
	});

	const titleKeyPath = usePageMeta('pages.title.projects');

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	onMounted(() => {
		headerUIStore.setPageTitle(titleKeyPath);

		footerUIStore.leftActionComponent = Button;
		footerUIStore.leftActionProps = {
			label: 'Projects Button left',
		};
		footerUIStore.rightActionComponent = Button;
		footerUIStore.rightActionProps = {
			label: 'Projects Button right',
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
