<template>
	<div>
		{{ userStore.displayName }}
	</div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

await callOnce(userStore.fetchData);
</script>
