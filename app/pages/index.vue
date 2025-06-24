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

	// TODO use config
	const APP_BASE = 'uploader';
	const AUTH_BASE = '/auth/sign-in/';
	const AUTH_SYS_URL = '/auth/sign-in/auth-systems/';
	const AUTH_EMAIL_OR_LOGIN = '?email-or-login=';
	const AUTH_RETURN = '&return-to=';

	function getAuthUrl(authSys: string, fPath: string, login: string): string {
		return AUTH_SYS_URL + authSys + '/' + authSys + fPath + 
			AUTH_EMAIL_OR_LOGIN + encodeURIComponent(login) +
			AUTH_RETURN + encodeURIComponent(APP_BASE);
	}

	async function getAuthSystem(login: string): Promise<void> {
		const url = AUTH_SYS_URL + AUTH_EMAIL_OR_LOGIN
			+ encodeURIComponent(login);
			// + AUTH_RETURN + encodeURIComponent(APP_BASE);

  		const ri = ({
    		headers: {
      			'Content-Type': 'text/html',
    		},
    		method: 'GET',
  		} as unknown) as Request;

  		const resp = await fetch(url, ri);
  		console.info('getAuthSystem: result:', resp.status);
		// TODO extract real auth system (but as we use only one, we report our default system)
  		return 'password';
	}

	function getCSRF(): string {
		const decodedCookie = decodeURIComponent(document.cookie);
		const ca = decodedCookie.split(';');
		let cv = '';
		const CSRF_COOKIE_NAME = 'madek.auth.anti-csrf-token';
		ca.forEach((element) => {
			const kv = element.split('=');
			if (kv[0] === CSRF_COOKIE_NAME) {
				cv = kv[1] || '';
			}
		});
		if (cv.length > 0) {
			console.info('getCSRF: found csrf cookie val: ', cv);
		} else {
			console.error('getCSRF: could not find csrf cookie value: ');
		}

		return cv;
	};

	async function checkLogin(authSys: string, login: string): Promise<void> {
		// TODO use auth-sys request by login to get CSRF token
		const url = getAuthUrl(authSys, '/request', login);
		const opts = ({
			headers: { 'Content-Type': 'text/html' },
			method: 'GET',
		} as unknown) as Request;
		const resp = await fetch(url, opts);
		console.info('checkLogin: got response:', resp.status);
	};

	const userStore = useUserStore();

	async function doAuthLogin(login: string, password: string): Promise<void> {
		console.info('doAuthLogin: ', login, password);
		// first get auth system and csrf cookie value
		const authSys = await getAuthSystem(login);
		// extract cookie value
		const cv = getCSRF();
		// check if login via auth-system exists (can be omitted perhabs)
		// checkLogin(authSys, login);

		const url = getAuthUrl(authSys, '/sign-in', login);

		const options = ({
			headers: {
				'madek.auth.anti-csrf-token': cv,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ password: password }),
		} as unknown) as Request;

		const resp = await fetch(url, options)
		const resp_data = await resp.text();
		console.info('doAuthLogin: got response:', resp.status);
		if (resp.status === 200) {
			await userStore.initialize();
			console.info('doAuthLogin: got auth info:', userStore.login);
		}
		else {
			console.error('doAuthLogin: error:', resp_data);
		}
	};

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

		doAuthLogin(formValues.username_or_email, formValues.password).then(() => {
			console.info('logged in');
		});
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
