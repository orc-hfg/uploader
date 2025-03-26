// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: "2025-01-24",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint"],
	typescript: {
		typeCheck: true,
	},
	runtimeConfig: {
		isMainApp: true,
	},
	extends: ["@orc-hfg/madek-api-nuxt-layer"],
});
