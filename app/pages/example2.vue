<script setup lang="ts">
const { data: user2 } = await useCachedAsyncData("user", () => getUserRepository().getAuthInfo());
</script>

<template>
	<div>
		<p>
			User Repository Example 2 (id):<br />
			{{ user2?.id }}
		</p>
		<NuxtLink to="/">Home</NuxtLink>
		<NuxtLink to="/example">Example</NuxtLink>
		<NuxtLink to="/example3">Example 3</NuxtLink>
	</div>
</template>
