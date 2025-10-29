<script lang="ts" setup>
// TODO: This is just a page for testing purposes (http://localhost:3000/uploader/example).
// Feel free to delete this file.

	definePageMeta({
		skipAuthentication: true,
		layout: false,
	});

	defineI18nRoute(false);

	const userStore = useUserStore();

	// Executed once on every page visit
	await callOnce('user-example', () => userStore.refresh(), { mode: 'navigation' });

	const { data: authInfo } = await useAsyncData(() => getUserRepository().getAuthInfo());
</script>

<template>
	<div>
		<p>
			User Store Getter (displayName):<br>
			{{ userStore.displayName }}
		</p>
		<p>
			User Repository (id):<br>
			{{ authInfo?.id }}
		</p>
		<NuxtLink to="/">
			Home
		</NuxtLink>
		<NuxtLink to="/example2">
			Example2
		</NuxtLink>
		<NuxtLink to="/example3">
			Example3
		</NuxtLink>
		<NuxtLink to="/example4">
			Example4
		</NuxtLink>
	</div>
</template>
