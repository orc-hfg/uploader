<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const userSetsStore = useUserSetsStore();

// Refresh user sets on navigation
await callOnce(() => userSetsStore.fetchData(), { mode: "navigation" });
</script>

<template>
	<div>
		<p>User Sets:</p>
		<ul>
			<li v-for="set in userSetsStore.sets" :key="set.id">
				{{ set.id }}
			</li>
		</ul>
	</div>
	<p>
		<small>Madek API Nuxt Layer Version:<br />{{ runtimeConfig.public.version }}</small>
	</p>
	<p>
		<small>Madek API Base URL:<br />{{ runtimeConfig.public.madekApi.baseUrl }}</small>
	</p>
</template>
