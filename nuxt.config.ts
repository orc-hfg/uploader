// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-01-24',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint'],
	typescript: {
		typeCheck: true,
	},
	extends: [
		['madek-api-nuxt-layer'],
		// ['github:orc-hfg/madek-api-nuxt-layer#1.0.0-alpha', { install: true }],
		// 'github:username/repoName/base', // GitHub Remote Source within /base directory
		// 'github:username/repoName#dev', // GitHub Remote Source from dev branch
		// 'github:username/repoName#v1.0.0', // GitHub Remote Source from v1.0.0 tag
	],
});
