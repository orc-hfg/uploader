<template>
	<div>
		{{ data.data.first_name }}
	</div>
</template>

<script setup>
const { data, pending, error } = useFetch('/api/auth-info');
console.log(data);
</script>
