<template>
	<div>
		<p>User Sets:</p>
		<ul>
			<li v-for="set in userSetsStore.sets" :key="set.id">
				{{ set.id }}
			</li>
		</ul>
	</div>
	<small>{{ runtimeConfig.public.version }}</small>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const userSetsStore = useUserSetsStore();

// Refresh user sets on navigation
await callOnce(() => userSetsStore.fetchData(), { mode: "navigation" });
</script>
