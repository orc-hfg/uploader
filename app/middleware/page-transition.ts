export default defineNuxtRouteMiddleware((to, from) => {
	if (typeof to.meta.pageTransition !== 'object' || typeof to.meta.pageTransition === 'boolean') {
		return;
	}

	const PAGE_ORDER = ['index', 'projects'];

	const toIndex = PAGE_ORDER.indexOf(String(to.name));
	const fromIndex = PAGE_ORDER.indexOf(String(from.name));

	if (toIndex !== -1 && fromIndex !== -1) {
		to.meta.pageTransition.name = toIndex > fromIndex ? 'slide-left' : 'slide-right';
	}
});
