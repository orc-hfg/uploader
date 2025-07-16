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
		email_or_login: '',
		password: '',
	});

	const loginFormSchema = z.object({
		email_or_login: z.string().min(1, { message: t('forms.errors.email_or_login_required') }),
		password: z.string().min(1, { message: t('forms.errors.password_required') }),
	});

	type LoginFormValues = z.infer<typeof loginFormSchema>;

	const resolver = ref(zodResolver(loginFormSchema));

	// Input field focus management
	const emailOrLoginInput = useTemplateRef<{
		$el: HTMLInputElement;
	}>('emailOrLoginInput');

	onStartTyping(() => {
		if (emailOrLoginInput.value && emailOrLoginInput.value.$el !== document.activeElement) {
			emailOrLoginInput.value.$el.focus();
		}
	});

	const loginError = ref<string | undefined>(undefined);

	function clearLoginError() {
		if (loginError.value) {
			loginError.value = undefined;
		}
	}

	async function onFormSubmit(event: FormSubmitEvent<Record<string, unknown>>) {
		if (!event.valid) {
			return;
		}

		/*
		 * Safe type assertion after zod validation and valid check.
		 * Bridges PrimeVue's generic API with our typed form values.
		 */
		const formValues = event.values as LoginFormValues;

		const { login } = useAuthentication();

		try {
			await login(formValues.email_or_login, formValues.password);

			const localeRoute = useLocaleRoute();
			await navigateTo(localeRoute('projects'));
		}
		catch (error) {
			if (error && typeof error === 'object' && 'statusCode' in error) {
				loginError.value = error.statusCode === 401 ? t('errors.invalid_credentials') : t('errors.login_failed');
			}
			else {
				loginError.value = t('errors.login_failed');
			}
		}
	}
</script>

<template>
	<Form id="loginForm" v-slot="$form" :initial-values="initialValues" :resolver="resolver" @submit="onFormSubmit">
		<Fluid>
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-1">
					<FloatLabel variant="in">
						<InputText id="email_or_login_label" ref="emailOrLoginInput" name="email_or_login" variant="filled" @update:model-value="clearLoginError" />
						<label for="email_or_login_label">{{ t('forms.labels.email_or_login') }}</label>
					</FloatLabel>
					<Message size="small" severity="secondary" variant="simple">
						{{ t('forms.help_texts.hfg_email') }}
					</Message>
					<Message v-if="$form.email_or_login?.invalid" severity="error" size="small" variant="simple">
						{{ $form.email_or_login.error?.message }}
					</Message>
				</div>
				<div class="flex flex-col gap-1">
					<FloatLabel variant="in">
						<Password input-id="password_label" name="password" variant="filled" :feedback="false" @update:model-value="clearLoginError" />
						<label for="password_label">{{ t('forms.labels.password') }}</label>
					</FloatLabel>
					<Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
						{{ $form.password.error?.message }}
					</Message>
				</div>
				<Message v-if="loginError" severity="error" variant="outlined" data-testid="login-error">
					{{ loginError }}
				</Message>
			</div>
		</Fluid>
	</Form>
</template>
