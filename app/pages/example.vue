<script setup lang="ts">
const userStore = useUserStore();
await callOnce(() => userStore.refreshData(), { mode: "navigation" }); // executed once on every page visit

const { data: user } = await useAsyncData(() => getUserRepository().getAuthInfo());

const { data: placeholderData } = await useAsyncData(() => getPlaceholderUserRepository().getUsers());
</script>

<template>
	<div>
		<p>
			User Store Getter (displayName):<br />
			{{ userStore.displayName }}
		</p>
		<p>
			User Repository (id):<br />
			{{ user?.id }}
		</p>
		Example: Placeholder User Repository:<br />
		<ul>
			<li v-for="user in placeholderData" :key="user.id">
				{{ user.name }}
			</li>
		</ul>
		<NuxtLink to="/">Home</NuxtLink>
		<NuxtLink to="/example2">Example2</NuxtLink>
		<NuxtLink to="/example3">Example3</NuxtLink>
	</div>
</template>
