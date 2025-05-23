<script setup lang="ts">
	definePageMeta({
		layout: false,
	});

	const metaTitle = useMetaTitle('Home');

	useHead({
		title: metaTitle,
	});

	const runtimeConfig = useRuntimeConfig();

	const { data: appSettings } = await useAsyncData(() => getSettingsRepository().getAppSettings());
</script>

<template>
	<div>
		<div>
			<p>
				App Settings:<br>
				{{ appSettings?.default_locale }}
			</p>
		</div>
		<p>
			<small>Madek API Nuxt Layer Version:<br>{{ runtimeConfig.public.version }}</small>
		</p>
		<p>
			<small>App Base URL:<br>{{ runtimeConfig.app.baseURL || 'not defined' }}</small>
		</p>
		<p>
			<small>Madek API Base URL:<br>{{ runtimeConfig.public.madekApi.baseURL }}</small>
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
