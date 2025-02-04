<template>
	<div>
		<h1>User Details</h1>

		<div v-if="pending">Lade Daten...</div>
		<div v-else-if="error">Fehler: {{ error.message }}</div>
		<div v-else>
			<p><strong>ID:</strong> {{ user.id }}</p>
			<p><strong>Name:</strong> {{ user.name }}</p>
			<p><strong>Email:</strong> {{ user.email }}</p>
		</div>
	</div>
</template>

<script setup>
const route = useRoute();
const userId = route.params.id;

const { data: user, pending, error } = useFetch(`/api/users/${userId}`);
</script>
