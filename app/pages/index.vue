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
		Placeholder User Repository:<br />
		<ul>
			<li v-for="user in placeholderData" :key="user.id">
				{{ user.name }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
await callOnce(userStore.fetchData);

const userRepository = getUserRepository();
const { data } = await useAsyncData(() => userRepository.getAuthInfo());

const placeholderUserRepository = getPlaceholderUserRepository();
const { data: placeholderData } = await useAsyncData(() => placeholderUserRepository.getUsers());
</script>
