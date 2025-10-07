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

	const footerUIStore = useFooterUIStore();
	const setsStore = useSetsStore();

	const { signOut } = useAuthentication();

	/*
	 * Load user sets data on initial load and on locale-based navigation
	 * Navigation mode ensures data refreshes when switching between different routes
	 */
	await callOnce(() => setsStore.refresh(locale.value), { mode: 'navigation' });

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

	const footerConfig = {
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
				icon: 'pi pi-plus',
				type: 'button',
			},
		},
	};

	onMounted(() => {
		footerUIStore.leftActionComponent = footerConfig.left.component;
		footerUIStore.leftActionProps = footerConfig.left.props;

		footerUIStore.rightActionComponent = footerConfig.right.component;
		footerUIStore.rightActionProps = footerConfig.right.props;
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
</script>

<template>
	<ul v-if="setsStore.sets.length > 0">
		<li
			v-for="setsData in setsStore.setsData" :key="setsData.id" class="
     border-slate-300 pb-10
     not-first:mt-10
     not-last:border-b-1
     last:pb-20
   "
		>
			<Project :id="setsData.id" :title="setsData.title ?? undefined" :cover-image-sources="setsData.coverImageSources" />
		</li>
	</ul>
	<PageMessage v-else :message="t('pages.projects.messages.no_sets')" />
</template>
