<script lang="ts" setup>
	import type { FormSubmitEvent } from '@primevue/forms';
	import { zodResolver } from '@primevue/forms/resolvers/zod';
	import { onStartTyping } from '@vueuse/core';
	import Button from 'primevue/button';
	import { z } from 'zod';

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

	const { t } = useI18n();

	onMounted(() => {
		headerUIStore.setPageTitleKeyPath(PAGE_TITLE_KEY_PATH);

		footerUIStore.rightActionComponent = Button;
		footerUIStore.rightActionProps = {
			label: t('footer.actions.login'),
			icon: 'pi pi-sign-in',
			type: 'submit',
			form: 'loginForm',
		};
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});

	// Form schema and validation setup
	const initialValues = ref({
		username_or_email: '',
		password: '',
	});

	const loginFormSchema = z.object({
		username_or_email: z.string().min(1, { message: t('forms.errors.username_or_email_required') }),
		password: z.string().min(1, { message: t('forms.errors.password_required') }),
	});

	type LoginFormValues = z.infer<typeof loginFormSchema>;

	const resolver = ref(zodResolver(loginFormSchema));

	// Input field focus management
	const usernameOrEmailInput = useTemplateRef<{
		$el: HTMLInputElement;
	}>('usernameOrEmailInput');

	onStartTyping(() => {
		if (usernameOrEmailInput.value && usernameOrEmailInput.value.$el !== document.activeElement) {
			usernameOrEmailInput.value.$el.focus();
		}
	});

	// Form submission handler
	function onFormSubmit(event: FormSubmitEvent<Record<string, unknown>>) {
		if (!event.valid) {
			return;
		}

		/*
		 * TODO: Implement exemplary authentication logic
		 * it should first just work somehow, then be fitted into the architecture
		 */

		/*
		 * Safe type assertion after zod validation and valid check.
		 * Bridges PrimeVue's generic API with our typed form values.
		 */
		const formValues = event.values as LoginFormValues;
		console.info('Form submitted', formValues);
	}
</script>

<template>
	<div>
		<Form id="loginForm" v-slot="$form" :initial-values :resolver @submit="onFormSubmit">
			<Fluid>
				<div class="flex flex-col gap-6">
					<div class="flex flex-col gap-1">
						<FloatLabel variant="in">
							<InputText id="username_or_email_label" ref="usernameOrEmailInput" name="username_or_email" variant="filled" />
							<label for="username_or_email_label">{{ t('forms.labels.username_or_email') }}</label>
						</FloatLabel>
						<Message size="small" severity="secondary" variant="simple">
							{{ t('forms.help_texts.hfg_email') }}
						</Message>
						<Message v-if="$form.username_or_email?.invalid" severity="error" size="small" variant="simple">
							{{ $form.username_or_email.error?.message }}
						</Message>
					</div>
					<div class="flex flex-col gap-1">
						<FloatLabel variant="in">
							<Password input-id="password_label" name="password" variant="filled" :feedback="false" />
							<label for="password_label">{{ t('forms.labels.password') }}</label>
						</FloatLabel>
						<Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
							{{ $form.password.error?.message }}
						</Message>
					</div>
				</div>
			</Fluid>
		</Form>
		<NuxtLinkLocale to="projects">
			Link: {{ $t('pages.title.projects') }}
		</NuxtLinkLocale>
	</div>
</template>
