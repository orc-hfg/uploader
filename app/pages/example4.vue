<script setup lang="ts">
	definePageMeta({
		skipAuthentication: true,
		layout: false,
	});

	defineI18nRoute(false);

	const setsStore = useSetsStore();

	// Refresh user sets on navigation
	await callOnce(() => setsStore.refreshData('de'), { mode: 'navigation' });

	const { data: appSettings } = await useAsyncData(() => getSettingsRepository().getAppSettings());
	const { data: contexts } = await useAsyncData(() => getContextsRepository().getContexts());
	const { data: coreContext } = await useAsyncData(() => getContextsRepository().getContextById('core'));
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
				<li v-for="setsData in setsStore.setsData" :key="setsData.id">
					{{ setsData.title }}
				</li>
			</ul>
		</div>
		<div>
			<p>
				App Settings:<br>
				{{ appSettings?.default_locale }}
			</p>
			Contexts:<br>
			<ul>
				<li v-for="context in contexts" :key="context.id">
					{{ context.id }}: {{ context?.labels?.de }} / {{ context?.labels?.en }}
				</li>
			</ul>
			<p>
				Context (core):<br>
				{{ coreContext?.labels?.de }} / {{ coreContext?.labels?.en }}
			</p>
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
