<script lang="ts" setup>
	import Button from 'primevue/button';
	import PageMessage from '@/components/PageMessage.vue';
	import Project from '@/components/Project.vue';

	const PAGE_TITLE_KEY_PATH = 'pages.projects.title';

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

	const appLogger = createAppLogger('Page: projects');

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();
	const setsStore = useSetsStore();

	const { t, locale } = useI18n();
	const { signOut } = useAuthentication();

	/*
	 * Load user sets data on initial load and on locale-based navigation
	 * Navigation mode ensures data refreshes when switching between different routes
	 */
	await callOnce(() => setsStore.refreshData(locale.value), { mode: 'navigation' });

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
		headerUIStore.setPageTitleKeyPath(PAGE_TITLE_KEY_PATH);

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
	<div>
		<ul v-if="setsStore.sets.length > 0">
			<li
				v-for="setsData in setsStore.setsData" :key="setsData.id" class="
      border-slate-300 pb-10
      not-first:mt-10
      not-last:border-b-1
      last:pb-20
    "
			>
				<Project :title="setsData.title ?? undefined" :thumbnail-sources="setsData.coverImageThumbnailSources" />
			</li>
		</ul>
		<PageMessage v-else :message="t('pages.projects.messages.no_sets')" />
		<!--
			<div class="mt-5">
			<NuxtLinkLocale to="index">
			Link: {{ $t('pages.sign_in.title') }}
			</NuxtLinkLocale>
			</div>
		-->
	</div>
</template>
