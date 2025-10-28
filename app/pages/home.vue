<script setup lang="ts">
// TODO: This is just a page for testing purposes (http://localhost:3000/uploader/home).
// Feel free to delete this file.

	definePageMeta({
		skipAuthentication: true,
		layout: false,
	});

	defineI18nRoute(false);
</script>

<template>
	<div>
		<p>
			<small>Madek API Nuxt Layer Version:<br>{{ $config.public.version }}</small>
		</p>
		<p>
			<small>App Base URL:<br>{{ $config.app.baseURL || 'not defined' }}</small>
		</p>
		<p>
			<small>Madek API Base URL:<br>{{ $config.public.madekApi.baseURL }}</small>
		</p>
		<div>
			<Button label="Test Button" />
			<NuxtLink to="/example">
				Example
			</NuxtLink>
			<NuxtLink to="/example2">
				Example2
			</NuxtLink>
			<NuxtLink to="/example3">
				Example3
			</NuxtLink>
			<NuxtLink to="/example4">
				Example4
			</NuxtLink>
		</div>
	</div>
</template>
