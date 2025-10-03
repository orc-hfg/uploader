<script lang="ts" setup>
	import type { FormSubmitEvent } from '@primevue/forms';
	import { zodResolver } from '@primevue/forms/resolvers/zod';
	import { StatusCodes } from 'http-status-codes';
	import Button from 'primevue/button';
	import { z } from 'zod';

	definePageMeta({
		pageTransition: {
			name: 'middleware-controlled',
		},
		middleware: 'page-transition',
	});

	defineI18nRoute({
		paths: {
			de: '/anmeldung',
			en: '/sign-in',
		},
	});

	const headerUIStore = useHeaderUIStore();
	const footerUIStore = useFooterUIStore();

	const { t } = useI18n();

	const footerConfig = {
		right: {
			component: Button,
			props: {
				label: t('footer.actions.sign_in'),
				icon: 'pi pi-sign-in',
				type: 'submit',
				form: 'signInForm',
			},
		},
	};

	onMounted(() => {
		headerUIStore.setPageTitleByKeyPath('pages.sign_in.title');

		footerUIStore.rightActionComponent = footerConfig.right.component;
		footerUIStore.rightActionProps = footerConfig.right.props;
	});

	onBeforeUnmount(() => {
		footerUIStore.reset();
	});

	// Form schema and validation setup
	const initialValues = ref({
		email_or_login: '',
		password: '',
	});

	const signInFormSchema = z.object({
		email_or_login: z.string().min(1, { message: t('forms.errors.email_or_login_required') }),
		password: z.string().min(1, { message: t('forms.errors.password_required') }),
	});

	type SignInFormValues = z.infer<typeof signInFormSchema>;

	const resolver = ref(zodResolver(signInFormSchema));

	// Input field focus management
	const emailOrLoginInput = useTemplateRef<{
		$el: HTMLInputElement;
	}>('emailOrLoginInput');

	onStartTyping(() => {
		if (emailOrLoginInput.value && emailOrLoginInput.value.$el !== document.activeElement) {
			emailOrLoginInput.value.$el.focus();
		}
	});

	const signInError = ref<string | undefined>(undefined);

	function clearSignInError() {
		if (signInError.value) {
			signInError.value = undefined;
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
		const signInFormValues = event.values as SignInFormValues;

		const { signIn } = useAuthentication();

		try {
			await signIn(signInFormValues.email_or_login, signInFormValues.password);

			const localeRoute = useLocaleRoute();
			await navigateTo(localeRoute('projects'));
		}
		catch (error) {
			if (error && typeof error === 'object' && 'statusCode' in error) {
				signInError.value = error.statusCode === StatusCodes.UNAUTHORIZED ? t('errors.invalid_credentials') : t('errors.sign_in_failed');
			}
			else {
				signInError.value = t('errors.sign_in_failed');
			}
		}
	}
</script>

<template>
	<Form id="signInForm" v-slot="$form" :initial-values="initialValues" :resolver="resolver" @submit="onFormSubmit">
		<!--
			Disable wcag/h32 rule due to architectural design decision.
			This application uses a separated footer pattern where action buttons (including submit buttons)
			are rendered in the footer component, not within form elements.
			The submit button is correctly connected via the form="signInForm" attribute and is fully functional.
		-->
		<!-- [html-validate-disable wcag/h32] -->

		<!--
			Disable element-permitted-content due to PrimeVue FloatLabel implementation.
			FloatLabel renders a <span> but Password component renders a <div>,
			which violates HTML nesting rules. This follows official PrimeVue documentation.
			See: https://primevue.org/inputtext/#floatlabel
		-->
		<!-- [html-validate-disable element-permitted-content] -->

		<!--
			Disable no-missing-references due to PrimeVue Password component bug.
			When feedback={false}, the overlay is not rendered but aria-controls attribute remains.
		-->
		<!-- [html-validate-disable no-missing-references] -->
		<Fluid>
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-1">
					<FloatLabel variant="in">
						<InputText id="email_or_login_label" ref="emailOrLoginInput" name="email_or_login" variant="filled" @update:model-value="clearSignInError" />
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
						<Password input-id="password_label" name="password" variant="filled" :feedback="false" @update:model-value="clearSignInError" />
						<label for="password_label">{{ t('forms.labels.password') }}</label>
					</FloatLabel>
					<Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
						{{ $form.password.error?.message }}
					</Message>
				</div>
				<Message v-if="signInError" severity="error" variant="outlined" data-testid="sign-in-error">
					{{ signInError }}
				</Message>
			</div>
		</Fluid>
	</Form>
</template>
