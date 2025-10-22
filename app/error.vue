<script setup lang="ts">
	import type { NuxtError } from '#app';
	import Button from 'primevue/button';
	import PageMessage from '@/components/elements/PageMessage.vue';

	const { error } = defineProps<{
		error: NuxtError;
	}>();

	const appLogger = createAppLogger('Error Page');

	appLogger.error('Application error occurred', {
		statusCode: error?.statusCode,
		statusMessage: error?.statusMessage,
		message: error?.message,
		stack: error?.stack,
	});

	const localeRoute = useLocaleRoute();
	const { t, locale } = useI18n();

	useRouteTitle(() => t('pages.error.title'));

	const projectsPath = computed(() => {
		const route = localeRoute('projects', locale.value);

		return route === undefined ? '/' : route.path;
	});

	function recoverFromError() {
		clearError({ redirect: projectsPath.value });
	}

	useFooterActions({
		right: {
			component: Button,
			props: {
				label: t('pages.error.actions.back_to_projects'),
				type: 'button',
				class: 'ml-auto',
				click: recoverFromError,
			},
		},
	});
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtLayout>
		<template #main>
			<PageMessage :title="$t('pages.error.messages.error_title')" :message="$t('pages.error.messages.error_message')" />
		</template>
	</NuxtLayout>
</template>
