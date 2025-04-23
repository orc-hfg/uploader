<script setup lang="ts">
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
	</div>
</template>
