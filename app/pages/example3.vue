<script setup lang="ts">
// TODO: This is just a page for testing purposes (http://localhost:3000/uploader/example3).
// Feel free to delete this file.

	definePageMeta({
		skipAuthentication: true,
		layout: false,
	});

	defineI18nRoute(false);

	const { data: user2 } = await useCachedAsyncData('user', () => getUserRepository().getAuthInfo());
</script>

<template>
	<div>
		<p>
			User Repository Example 3 (id):<br>
			{{ user2?.id }}
		</p>
		<NuxtLink to="/">
			Home
		</NuxtLink>
		<NuxtLink to="/example">
			Example
		</NuxtLink>
		<NuxtLink to="/example2">
			Example 2
		</NuxtLink>
		<NuxtLink to="/example4">
			Example 4
		</NuxtLink>
	</div>
</template>
