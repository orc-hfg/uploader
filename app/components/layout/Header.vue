<script setup lang="ts">
	import type { RouteBaseName } from '@/constants/routes';
	import { NuxtLink, NuxtLinkLocale } from '#components';
	import Button from 'primevue/button';
	import Text from '@/components/elements/Text.vue';
	import Fade from '@/components/transitions/Fade.vue';
	import { ROUTE_BASE_NAME_ORDER } from '@/constants/routes';

	const switchLocalePath = useSwitchLocalePath();

	const route = useRoute();
	const { $routeBaseName } = useNuxtApp();

	const previousRouteBaseName = computed(() => {
		const currentRouteBaseName = $routeBaseName(route);

		if (currentRouteBaseName === undefined || typeof currentRouteBaseName !== 'string') {
			// Explicit undefined required to satisfy consistent-return rule while using early returns
			// eslint-disable-next-line unicorn/no-useless-undefined
			return undefined;
		}

		const currentRouteBaseNameIndex = ROUTE_BASE_NAME_ORDER.indexOf(currentRouteBaseName as RouteBaseName);

		if (currentRouteBaseNameIndex <= 0) {
			// Explicit undefined required to satisfy consistent-return rule while using early returns
			// eslint-disable-next-line unicorn/no-useless-undefined
			return undefined;
		}

		return ROUTE_BASE_NAME_ORDER[currentRouteBaseNameIndex - 1];
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
				:to="{ name: previousRouteBaseName }"
				:aria-label="$t('header.previous_page')"
				icon="pi pi-arrow-left"
				severity="contrast"
				variant="text"
				rounded
			/>
		</div>
		<div class="flex justify-center">
			<!--
				ClientOnly wrapper prevents hydration mismatch and HTML validation errors:
				- The layout (including header) renders before the page setup runs
				- Server: Renders visually hidden <h1> with app title to satisfy HTML validation
				- Page setup: Sets the route-specific title via useRouteTitle()
				- Client: Replaces with visible page title, avoiding hydration mismatch
				- This approach ensures valid HTML (non-empty h1) without server/client content conflicts
				- SEO is unaffected as the page title is set in <Head><Title> in the layout
			-->
			<ClientOnly>
				<Text as="h1" variant="headline-small" class="truncate px-4 text-center">
					<Fade>
						<span :key="$route.meta.pageTitle">{{ $route.meta.pageTitle }}</span>
					</Fade>
				</Text>
				<template #fallback>
					<Text as="h1" variant="headline-small" class="sr-only">
						{{ $t('app.title') }}
					</Text>
				</template>
			</ClientOnly>
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
