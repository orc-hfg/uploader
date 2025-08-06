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

	const { t } = useI18n();

	async function handleLogout() {
		const { logout } = useAuthentication();

		try {
			await logout();

			const localeRoute = useLocaleRoute();
			await navigateTo(localeRoute('index'));
		}
		catch (error) {
			appLogger.error('Logout failed', error);
		}
	}

	const footerConfig = {
		left: {
			component: Button,
			props: {
				label: 'Logout (Test)',
				type: 'button',
				click: handleLogout,
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
		<!--
			<NuxtLinkLocale to="index">
			Link: {{ $t('pages.title.login') }}
			</NuxtLinkLocale>
		-->
	</div>
</template>
