<template>
	<div>
		{{ authInfo.first_name }}
	</div>
</template>

<script setup>
const { data: authInfo, pending, error } = useFetch('/api/auth-info');
</script>
