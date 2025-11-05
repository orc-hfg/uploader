<script setup lang="ts">
// TODO: This is just a page for testing purposes (http://localhost:3000/uploader/example4).
// Feel free to delete this file.

	definePageMeta({
		skipAuthenticationCheck: true,
		layout: false,
	});

	defineI18nRoute(false);

	const setsStore = useSetsStore();

	// Refresh user sets on navigation
	await callOnce('sets-de-example', () => setsStore.refresh('de'), { mode: 'navigation' });
</script>

<template>
	<div>
		<div>
			<p>User Sets:</p>
			<ul>
				<li v-for="set in setsStore.sets" :key="set.id">
					{{ set.id }}
				</li>
			</ul>
			<p>User Set Titles:</p>
			<ul>
				<li v-for="setsDisplayData in setsStore.setsDisplayData" :key="setsDisplayData.id">
					{{ setsDisplayData.title }}
				</li>
			</ul>
		</div>
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
		</div>
	</div>
</template>
