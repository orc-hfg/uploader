// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-01-24',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint'],
	typescript: {
		typeCheck: true,
	},
	extends: ['@orc-hfg/madek-api-nuxt-layer'],
});
