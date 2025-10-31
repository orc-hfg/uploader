<script lang="ts" setup>
	import Button from 'primevue/button';
	import Project from '@/components/content/Project.vue';
	import PageMessage from '@/components/elements/PageMessage.vue';

	definePageMeta({
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

	const appLogger = createAppLogger('Page: projects');

	const { t, locale } = useI18n();

	useRouteTitle(() => t('pages.projects.title'));

	const setsStore = useSetsStore();

	const { signOut } = useAuthentication();

	// Read mock scenario for E2E testing
	const mockScenario = useMockScenario();

	/*
	 * Initialize Nuxt context before callOnce
	 * This ensures useRuntimeConfig() and other composables used by the Layer are available
	 * Without this, the Layer's internal useRuntimeConfig() calls fail with "composable called outside of context"
	 */
	useNuxtApp();

	/*
	 * Load user sets data on initial load and on locale-based navigation
	 * Navigation mode ensures data refreshes when switching between different routes
	 * Key includes locale and mockScenario to ensure proper cache invalidation when these change
	 */
	await callOnce(`sets-${locale.value}-${mockScenario}`, () => setsStore.refresh(locale.value, mockScenario), { mode: 'navigation' });

	async function handleSignOut() {
		try {
			await signOut();

			const localeRoute = useLocaleRoute();
			await navigateTo(localeRoute('index'));
		}
		catch (error) {
			appLogger.error('Sign-out failed', error);
		}
	}

	useFooterActions({
		/*
		 * TODO: Sign-out button is temporary for testing purposes.
		 * It will be integrated into a proper header menu component in the future.
		 */
		left: {
			component: Button,
			props: {
				label: 'Abmelden (Test)',
				type: 'button',
				click: handleSignOut,
			},
		},
		right: {
			component: Button,
			props: {
				label: t('footer.actions.new_project'),
				type: 'button',
				icon: 'pi pi-plus',
			},
		},
	});
</script>

<template>
	<ul v-if="setsStore.sets.length > 0">
		<li
			v-for="setsDisplayData in setsStore.setsDisplayData" :key="setsDisplayData.id" class="
     border-surface-300 pb-10
     not-first:mt-10
     not-last:border-b
     last:pb-20
   "
		>
			<Project :id="setsDisplayData.id" :title="setsDisplayData.title ?? undefined" :cover-image-sources="setsDisplayData.coverImageSources" />
		</li>
	</ul>
	<PageMessage v-else :message="t('pages.projects.messages.no_sets')" />
</template>
