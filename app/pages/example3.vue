<script setup lang="ts">
	definePageMeta({
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
