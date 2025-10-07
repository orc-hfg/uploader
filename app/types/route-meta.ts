declare module '#app' {
	interface PageMeta {
		pageTitle?: string;
	}
}

/*
 * It is always important to ensure you import/export something when augmenting a type
 * See: https://nuxt.com/docs/4.x/guide/directory-structure/app/pages#typing-custom-metadata
 */
// eslint-disable-next-line unicorn/require-module-specifiers
export {};
