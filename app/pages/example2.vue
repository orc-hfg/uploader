<script setup lang="ts">
	definePageMeta({
		layout: false,
	});

	const metaTitle = useMetaTitle('Example2');

	useHead({
		title: metaTitle,
	});

	const { data: user2 } = await useCachedAsyncData('user', () => getUserRepository().getAuthInfo());
</script>

<template>
	<div>
		<p>
			User Repository Example 2 (id):<br>
			{{ user2?.id }}
		</p>
		<NuxtLink to="/">
			Home
		</NuxtLink>
		<NuxtLink to="/example">
			Example
		</NuxtLink>
		<NuxtLink to="/example3">
			Example 3
		</NuxtLink>
		<NuxtLink to="/example4">
			Example 4
		</NuxtLink>
	</div>
</template>
