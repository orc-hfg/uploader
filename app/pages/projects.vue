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

	const appLogger = createAppLogger('Page: projects');

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();
	const userSetsStore = useUserSetsStore();

	const { t, locale } = useI18n();
	const { signOut } = useAuthentication();

	/*
	 * Load user sets data on initial load and on locale-based navigation
	 * Navigation mode ensures data refreshes when switching between different routes
	 */
	await callOnce(() => userSetsStore.refreshData(locale.value), { mode: 'navigation' });

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
		<ul>
			<li v-for="setTitle in userSetsStore.setTitles" :key="setTitle.id">
				{{ setTitle.string }}
			</li>
		</ul>

		<div class="mt-5">
			<NuxtLinkLocale to="index">
				Link: {{ $t('pages.title.sign_in') }}
			</NuxtLinkLocale>
		</div>
	</div>
</template>
