export default defineNuxtRouteMiddleware((to, from) => {
	if (typeof to.meta.pageTransition !== 'object' || typeof to.meta.pageTransition === 'boolean') {
		return;
	}

	const motion = usePreferredReducedMotion();
	if (motion.value === 'reduce') {
		// Use fade transition for reduced motion: https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/
		to.meta.pageTransition.name = 'fade-transition';
		to.meta.pageTransition.mode = 'out-in';

		return;
	}

	const PAGE_ORDER = ['index', 'projects', 'project-id'];

	const { $routeBaseName } = useNuxtApp();
	const toBaseName = $routeBaseName(to);
	const fromBaseName = $routeBaseName(from);

	let transitionName = 'no-transition';

	if (
		typeof toBaseName === 'string'
		&& typeof fromBaseName === 'string'
		&& toBaseName !== fromBaseName
	) {
		const toIndex = PAGE_ORDER.indexOf(toBaseName);
		const fromIndex = PAGE_ORDER.indexOf(fromBaseName);

		if (toIndex !== -1 && fromIndex !== -1) {
			transitionName = toIndex > fromIndex ? 'slide-left' : 'slide-right';
		}
	}

	to.meta.pageTransition.name = transitionName;
});
