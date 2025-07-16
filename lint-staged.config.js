export default {
	'*.{ts,vue,md,json}': 'eslint --fix',
	'*.{ts,vue}': () => ['npm run check:types', 'npm run check:unused', 'npm run test'],
};
