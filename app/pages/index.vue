<template>
	<div>
		<p>
			User Store Getter (displayName):<br />
			{{ userStore.displayName }}
		</p>
		<p>
			User Repository (id):<br />
			{{ data?.id }}
		</p>
	</div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
await callOnce(userStore.fetchData);

const userRepository = useUserRepository();
const { data } = await useAsyncData(() => userRepository.getAuthInfo());
</script>
