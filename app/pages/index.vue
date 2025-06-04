<script lang="ts" setup>
	import Button from 'primevue/button';
	import { useI18n } from 'vue-i18n';

	definePageMeta({
		pageTransition: {
			name: 'slide-left',
		},
		middleware: 'page-transition',
	});

	const title = usePageMeta('pages.title.login');

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	const { setLocale } = useI18n();
	const switchToGerman = () => setLocale('de');
	const switchToEnglish = () => setLocale('en');

	onMounted(() => {
		headerUIStore.titleTranslationKey = title;

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
			<NuxtLinkLocale to="projects">
				{{ $t('pages.title.projects') }}
			</NuxtLinkLocale>

			<button type="button" @click="switchToGerman">
				Deutsch
			</button>

			<button type="button" @click="switchToEnglish">
				English
			</button>
			<!--
				<SwitchLocalePathLink locale="de">
				Deutsch
				</SwitchLocalePathLink>

				<SwitchLocalePathLink locale="en">
				English
				</SwitchLocalePathLink>
			-->
		</div>
	</div>
</template>
