<script lang="ts" setup>
	import { useFooterUIStore } from '@/stores/footer-ui';
	import { useHeaderUIStore } from '@/stores/header-ui';
	import Button from 'primevue/button';

	definePageMeta({
		pageTransition: {
			name: 'slide-left',
		},
		middleware: 'page-transition',
	});

	const title = usePageMeta('Projects');

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	onMounted(() => {
		headerUIStore.title = title;

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
		<div class="text-2xl font-bold bg-primary-300 text-primary-50 p-4 h-full">
			<NuxtLink to="/">
				Login
			</NuxtLink>
		</div>
	</div>
</template>
