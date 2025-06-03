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

	const title = usePageMeta('Login');

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	onMounted(() => {
		headerUIStore.title = title;

		footerUIStore.leftActionComponent = Button;
		footerUIStore.leftActionProps = {
			label: 'Login Button left',
		};
		footerUIStore.rightActionComponent = Button;
		footerUIStore.rightActionProps = {
			label: 'Login Button right',
		};
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
</script>

<template>
	<div class="h-full">
		<div class="h-full bg-primary-200 p-4 text-2xl font-bold text-primary-50">
			<NuxtLink to="/projects">
				Projects
			</NuxtLink>
		</div>
	</div>
</template>
