import type { RouteBaseName } from '@/constants/routes';
import { ROUTE_BASE_NAME_ORDER } from '@/constants/routes';

export default defineNuxtRouteMiddleware((to, from) => {
	const config = useRuntimeConfig();
	const publicConfig = config.public;
	const isFadeTransitionFallbackEnabled = publicConfig.enableFadeTransitionFallback;

	if (typeof to.meta.pageTransition !== 'object' || typeof to.meta.pageTransition === 'boolean') {
		return;
	}

	const preferredReducedMotion = usePreferredReducedMotion();
	if (preferredReducedMotion.value === 'reduce' || isFadeTransitionFallbackEnabled) {
		// Use fade transition for reduced motion or when forced: https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/
		to.meta.pageTransition.name = 'fade-transition';
		to.meta.pageTransition.mode = 'out-in';

		return;
	}

	const { $routeBaseName } = useNuxtApp();
	const toRouteBaseName = $routeBaseName(to);
	const fromRouteBaseName = $routeBaseName(from);

	let pageTransitionName = 'no-transition';

	if (
		typeof toRouteBaseName === 'string'
		&& typeof fromRouteBaseName === 'string'
		&& toRouteBaseName !== fromRouteBaseName
	) {
		const toRouteBaseNameIndex = ROUTE_BASE_NAME_ORDER.indexOf(toRouteBaseName as RouteBaseName);
		const fromRouteBaseNameIndex = ROUTE_BASE_NAME_ORDER.indexOf(fromRouteBaseName as RouteBaseName);

		if (toRouteBaseNameIndex !== -1 && fromRouteBaseNameIndex !== -1) {
			pageTransitionName = toRouteBaseNameIndex > fromRouteBaseNameIndex ? 'slide-left' : 'slide-right';
		}
	}

	to.meta.pageTransition.name = pageTransitionName;
});
