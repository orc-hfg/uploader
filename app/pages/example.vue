<script lang="ts" setup>
	const metaTitle = useMetaTitle('Example');

	useHead({
		title: metaTitle,
	});

	const userStore = useUserStore();
	await callOnce(() => userStore.refreshData(), { mode: 'navigation' }); // executed once on every page visit

	const { data: authInfo } = await useAsyncData(() => getUserRepository().getAuthInfo());

	const { data: placeholderData } = await useAsyncData(() => getPlaceholderUserRepository().getUsers());
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
		Placeholder User Repository (to demonstrate usage of different API):<br>
		<ul>
			<li v-for="user in placeholderData" :key="user.id">
				{{ user.name }}
			</li>
		</ul>
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
