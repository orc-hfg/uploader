<script setup lang="ts">
	import type { RouteBaseName } from '@/constants/routes';
	import { NuxtLink, NuxtLinkLocale } from '#components';
	import Button from 'primevue/button';
	import Text from '@/components/elements/Text.vue';
	import Fade from '@/components/transitions/Fade.vue';
	import { ROUTE_BASE_NAME_ORDER } from '@/constants/routes';

	const headerUIStore = useHeaderUIStore();

	const switchLocalePath = useSwitchLocalePath();

	const route = useRoute();
	const { $routeBaseName } = useNuxtApp();

	const previousRouteBaseName = computed(() => {
		/* eslint-disable consistent-return */
		const currentRouteBaseName = $routeBaseName(route);

		if (currentRouteBaseName === undefined || typeof currentRouteBaseName !== 'string') {
			return;
		}

		const currentRouteBaseNameIndex = ROUTE_BASE_NAME_ORDER.indexOf(currentRouteBaseName as RouteBaseName);

		if (currentRouteBaseNameIndex <= 0) {
			return;
		}

		const targetRouteBaseName = ROUTE_BASE_NAME_ORDER[currentRouteBaseNameIndex - 1];

		if (!targetRouteBaseName) {
			return;
		}

		return targetRouteBaseName;
		/* eslint-enable consistent-return */
	});
</script>

<template>
	<div
		class="
    grid h-full
    grid-cols-[minmax(110px,_1fr)_minmax(0,_auto)_minmax(110px,_1fr)]
    items-center px-4
  "
	>
		<div class="flex justify-start">
			<Button
				v-if="previousRouteBaseName"
				:as="NuxtLinkLocale"
				:to="previousRouteBaseName"
				:aria-label="$t('header.previous_page')"
				icon="pi pi-arrow-left"
				severity="contrast"
				variant="text"
				rounded
			/>
		</div>
		<div class="flex justify-center">
			<Text
				v-if="headerUIStore.pageTitleDisplay" as="h1" variant="headline-small" class="
      truncate px-4 text-center
    "
			>
				<slot>
					<Fade>
						<span :key="headerUIStore.pageTitleDisplay">{{ headerUIStore.pageTitleDisplay }}</span>
					</Fade>
				</slot>
			</Text>
		</div>
		<div class="flex justify-end">
			<!--
				TODO: Language switchers are temporary for testing purposes.
				This feature will be integrated into a proper menu component in the future.
			-->
			<ClientOnly>
				<div class="flex items-center">
					<Button
						:as="NuxtLink"
						:to="switchLocalePath('de')"
						label="DE"
						severity="contrast"
						variant="text"
						rounded
					/>
					<div class="mx-1">
						|
					</div>
					<Button
						:as="NuxtLink"
						:to="switchLocalePath('en')"
						label="EN"
						severity="contrast"
						variant="text"
						rounded
					/>
				</div>
			</ClientOnly>
		</div>
	</div>
</template>
