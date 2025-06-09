export default defineNuxtRouteMiddleware((to, from) => {
	if (typeof to.meta.pageTransition !== 'object' || typeof to.meta.pageTransition === 'boolean') {
		return;
	}

	const PAGE_ORDER = ['index', 'projects'];

	const { $getRouteBaseName } = useNuxtApp();
	const toBaseName = $getRouteBaseName(to);
	const fromBaseName = $getRouteBaseName(from);

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
