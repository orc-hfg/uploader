<script lang="ts" setup>
	import Button from 'primevue/button';

	const PAGE_TITLE_KEY_PATH = 'pages.title.login';

	definePageMeta({
		pageTitleKeyPath: PAGE_TITLE_KEY_PATH,
		pageTransition: {
			name: 'middleware-controlled',
		},
		middleware: 'page-transition',
	});

	defineI18nRoute({
		paths: {
			de: '/anmeldung',
			en: '/login',
		},
	});

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	const { t, locale, locales, setLocale } = useI18n();

	const availableLocales = computed(() => {
		return locales.value.filter(index => index.code !== locale.value);
	});

	onMounted(() => {
		headerUIStore.setPageTitleKeyPath(PAGE_TITLE_KEY_PATH);

		footerUIStore.rightActionComponent = Button;
		footerUIStore.rightActionProps = {
			label: t('footer.actions.login'),
		};
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});
</script>

<template>
	<div class="h-full">
		<div class="h-full bg-primary-200 p-4 text-2xl font-bold text-primary-50">
			<NuxtLinkLocale to="projects">
				{{ $t('pages.title.projects') }}
			</NuxtLinkLocale>

			<button v-for="localeOption in availableLocales" :key="localeOption.code" type="button" @click="() => setLocale(localeOption.code)">
				{{ localeOption.name }}
			</button>

			<SwitchLocalePathLink locale="de">
				Deutsch
			</SwitchLocalePathLink>

			<SwitchLocalePathLink locale="en">
				English
			</SwitchLocalePathLink>
		</div>
	</div>
</template>
