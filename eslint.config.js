// Further configuration examples can be found at the end of the file

import antfu from '@antfu/eslint-config';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import eslintPluginSonarJs from 'eslint-plugin-sonarjs';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
	antfu(
		{
			typescript: {
				// Enables type-aware linting
				tsconfigPath: 'tsconfig.json',
			},
			vue: {
				a11y: true,
			},
			unicorn: {
				allRecommended: true,
			},
			stylistic: {
				indent: 'tab',
				semi: true,
			},
			...eslintPluginSonarJs.configs.recommended,
		},
		{
			files: ['**/*.ts', '**/*.vue'],
			rules: {
				'arrow-body-style': [
					'error',
					'as-needed',
					{
						requireReturnForObjectLiteral: true,
					},
				],
				'capitalized-comments': 'error',
				'consistent-return': 'error',
				'curly': 'error',
				'default-case': 'error',
				'default-param-last': 'error',
				'for-direction': 'error',
				'func-names': 'error',
				'func-name-matching': 'error',
				'func-style': ['error', 'declaration'],
				'grouped-accessor-pairs': 'error',
				'guard-for-in': 'error',
				'no-await-in-loop': 'error',
				'no-bitwise': 'error',
				'no-console': [
					'error',
					{
						allow: ['info', 'warn', 'error'],
					},
				],
				'no-continue': 'error',
				'no-implicit-coercion': 'error',
				'no-multi-assign': 'error',
				'logical-assignment-operators': 'error',
				'no-constant-binary-expression': 'error',
				'no-constant-condition': 'error',
				'no-div-regex': 'error',
				'no-dupe-else-if': 'error',
				'no-else-return': [
					'error',
					{
						allowElseIf: false,
					},
				],
				'no-empty-static-block': 'error',
				'no-extra-label': 'error',
				'no-nonoctal-decimal-escape': 'error',
				'no-lonely-if': 'error',
				'no-param-reassign': 'error',
				'no-plusplus': [
					'error',
					{
						allowForLoopAfterthoughts: true,
					},
				],
				'no-promise-executor-return': 'error',
				'no-return-assign': ['error', 'always'],
				'no-script-url': 'error',
				'no-shadow': 'error',
				'no-unsafe-optional-chaining': 'error',
				'no-useless-concat': 'error',
				'no-useless-escape': 'error',
				'no-void': 'error',
				'operator-assignment': ['error', 'never'],
				'prefer-destructuring': [
					'error',
					{
						object: true,
						array: false,
					},
				],
				'prefer-named-capture-group': 'error',
				'prefer-numeric-literals': 'error',
				'prefer-object-has-own': 'error',
				'prefer-object-spread': 'error',
				'radix': 'error',
				'require-unicode-regexp': 'error',
				'require-yield': 'error',
				'import/no-deprecated': 'error',
				'import/no-import-module-exports': 'error',
				'style/array-bracket-newline': 'error',
				'style/curly-newline': 'error',
				'style/function-call-spacing': 'error',
				'style/implicit-arrow-linebreak': 'error',
				'style/line-comment-position': 'error',
				'style/linebreak-style': 'error',
				'style/lines-around-comment': 'error',
				'style/multiline-comment-style': 'error',
				'style/no-confusing-arrow': 'error',
				'style/no-extra-parens': 'error',
				'style/object-curly-newline': 'error',
				'style/one-var-declaration-per-line': 'error',
				'style/padding-line-between-statements': [
					'error',
					{ blankLine: 'always', prev: '*', next: ['enum', 'interface', 'type', 'return'] },
				],
				'style/semi-style': 'error',
				'style/switch-colon-spacing': 'error',
				'style/wrap-regex': 'error',
				'perfectionist/sort-variable-declarations': 'error',
				'perfectionist/sort-intersection-types': 'error',
				'perfectionist/sort-heritage-clauses': 'error',
				'perfectionist/sort-array-includes': 'error',
				'perfectionist/sort-object-types': 'error',
				'perfectionist/sort-switch-case': 'error',
				'perfectionist/sort-decorators': 'error',
				'perfectionist/sort-enums': 'error',
				'perfectionist/sort-sets': 'error',
				'perfectionist/sort-maps': 'error',
				'sonarjs/todo-tag': 'warn',
				'unicorn/prevent-abbreviations': [
					'error',
					{
						replacements: {
							props: {
								properties: false,
							},
						},
					},
				],
			},
		},
		{
			files: ['**/*.ts'],
			rules: {
				'no-useless-assignment': 'error',
				'ts/explicit-function-return-type': 'error',
				'camelcase': 'off',
				'ts/naming-convention': [
					'error',
					// 1) All types (classes, interfaces, enums, type aliases, etc.) => PascalCase
					{
						selector: 'typeLike',
						format: ['PascalCase'],
					},
					// 2) Interfaces must NOT start with 'I'
					{
						selector: 'interface',
						format: ['PascalCase'],
						custom: {
							regex: '^I[A-Z]',
							match: false,
						},
					},
					// 3) Boolean variables => camelCase with prefix (is/has/etc.)
					{
						selector: 'variable',
						types: ['boolean'],
						format: ['PascalCase'], // Note: As documented, the prefix is trimmed before format is validated, thus PascalCase must be used to allow variables such as isEnabled
						prefix: ['is', 'should', 'has', 'can', 'did', 'was', 'will'],
					},
					// 4) Destructured variables => camelCase
					{
						selector: 'variable',
						modifiers: ['destructured'],
						format: ['camelCase'],
					},
					// 5) This rule allows both camelCase and UPPER_CASE for const variables.
					// If the variable name strictly matches ^[A-Z0-9_]+$ (e.g. API_URL),
					// the rule enforces correct uppercase formatting. Otherwise, it accepts camelCase.
					{
						selector: 'variable',
						modifiers: ['const'],
						format: ['UPPER_CASE', 'camelCase'],
						filter: {
							regex: '^[A-Z0-9_]+$',
							match: true,
						},
					},
					// 6) Other variables => camelCase
					{
						selector: 'variable',
						format: ['camelCase'],
					},
					// 7) Parameters => camelCase with optional leading underscore
					{
						selector: 'parameter',
						format: ['camelCase'],
						leadingUnderscore: 'allow',
					},
					// 8) Functions => camelCase
					{
						selector: 'function',
						format: ['camelCase'],
					},
				],
				'ts/no-floating-promises': 'error',
				'no-magic-numbers': 'off',
				'ts/no-magic-numbers': [
					'error',
					{
						ignoreReadonlyClassProperties: true,
						ignore: [-1, 0, 1],
						ignoreArrayIndexes: true,
					},
				],
				'ts/no-misused-promises': 'error',
				'ts/promise-function-async': 'error',
				'ts/return-await': ['error', 'in-try-catch'],
				'ts/adjacent-overload-signatures': 'error',
				'ts/array-type': 'error',
				'ts/ban-tslint-comment': 'error',
				'ts/class-literal-property-style': 'error',
				'ts/consistent-generic-constructors': 'error',
				'ts/consistent-indexed-object-style': 'error',
				'ts/consistent-type-assertions': 'error',
				'ts/no-array-delete': 'error',
				'ts/no-base-to-string': 'error',
				'ts/no-confusing-non-null-assertion': 'error',
				'ts/no-confusing-void-expression': 'error',
				'ts/no-deprecated': 'error',
				'ts/no-duplicate-type-constituents': 'error',
				'ts/no-empty-function': 'error',
				'ts/no-inferrable-types': 'error',
				'ts/no-loop-func': 'error',
				'ts/no-meaningless-void-operator': 'error',
				'ts/no-misused-spread': 'error',
				'ts/no-mixed-enums': 'error',
				'ts/no-redundant-type-constituents': 'error',
				'ts/no-unnecessary-boolean-literal-compare': 'error',
				'ts/no-unnecessary-condition': 'error',
				'ts/no-unnecessary-template-expression': 'error',
				'ts/no-unnecessary-type-arguments': 'error',
				'ts/no-unnecessary-type-parameters': 'error',
				'ts/no-unsafe-enum-comparison': 'error',
				'ts/no-unsafe-unary-minus': 'error',
				'ts/non-nullable-type-assertion-style': 'error',
				'ts/only-throw-error': 'error',
				'ts/prefer-find': 'error',
				'ts/prefer-for-of': 'error',
				'ts/prefer-function-type': 'error',
				'ts/prefer-includes': 'error',
				'ts/prefer-nullish-coalescing': 'error',
				'ts/prefer-optional-chain': 'error',
				'ts/prefer-promise-reject-errors': 'error',
				'ts/prefer-reduce-type-parameter': 'error',
				'ts/prefer-regexp-exec': 'error',
				'ts/prefer-return-this-type': 'error',
				'ts/prefer-string-starts-ends-with': 'error',
				'ts/related-getter-setter-pairs': 'error',
				'ts/require-await': 'error',
				'ts/use-unknown-in-catch-callback-variable': 'error',
			},
		},
		{
			files: ['**/*.vue'],
			plugins: {
				'better-tailwindcss': eslintPluginBetterTailwindcss,
			},
			settings: {
				'better-tailwindcss': {
					entryPoint: './app/assets/css/main.css',
				},
			},
			rules: {
				...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
				'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
				'better-tailwindcss/multiline': [
					'error',
					{
						printWidth: 100,
					},
				],
				'better-tailwindcss/no-conflicting-classes': 'error',
				'better-tailwindcss/no-restricted-classes': [
					'error',
					{
						restrict: [
							// eslint-disable-next-line unicorn/prefer-string-raw
							'^\\*+:.*',
							'^.*!$',
						],
					},
				],
				'better-tailwindcss/no-unregistered-classes': 'off',
				'vue/block-lang': [
					'error',
					{
						script: {
							lang: 'ts',
						},
					},
				],
				'vue/camelcase': 'error',
				'vue/component-api-style': 'error',
				'vue/define-emits-declaration': 'error',
				'vue/define-props-declaration': 'error',
				'vue/enforce-style-attribute': 'error',
				'vue/func-call-spacing': 'error',
				'vue/html-button-has-type': 'error',
				'vue/html-comment-content-newline': 'error',
				'vue/html-comment-indent': ['error', 'tab'],
				'vue/max-props': [
					'error',
					{
						maxProps: 5,
					},
				],
				'vue/new-line-between-multi-line-property': [
					'error',
					{
						minLineOfMultilineProperty: 2,
					},
				],
				'vue/next-tick-style': 'error',
				'vue/no-boolean-default': 'error',
				'vue/no-console': [
					'error',
					{
						allow: ['info', 'warn', 'error'],
					},
				],
				'vue/no-constant-condition': 'error',
				'vue/no-custom-modifiers-on-v-model': 'error',
				'vue/no-duplicate-attr-inheritance': 'error',
				'vue/no-empty-component-block': 'error',
				'vue/no-extra-parens': 'error',
				'vue/no-implicit-coercion': 'error',
				'vue/no-multiple-objects-in-class': 'error',
				'vue/no-ref-object-reactivity-loss': 'error',
				'vue/no-root-v-if': 'error',
				'vue/no-static-inline-styles': 'error',
				'vue/no-template-target-blank': 'error',
				'vue/no-undef-properties': 'error',
				'vue/no-use-v-else-with-v-for': 'error',
				'vue/no-useless-concat': 'error',
				'vue/no-useless-mustaches': 'error',
				'vue/no-v-text': 'error',
				'vue/padding-line-between-tags': [
					'error',
					[
						{
							blankLine: 'consistent',
							prev: '*',
							next: '*',
						},
					],
				],
				'vue/prefer-prop-type-boolean-first': 'error',
				'vue/prefer-true-attribute-shorthand': 'error',
				'vue/prefer-use-template-ref': 'error',
				'vue/require-emit-validator': 'error',
				'vue/require-macro-variable-name': 'error',
				'vue/require-typed-ref': 'error',
				'style/indent': 'off',
				'vue/script-indent': [
					'error',
					'tab',
					{
						baseIndent: 1,
					},
				],
				'vue/slot-name-casing': 'error',
				'vue/v-for-delimiter-style': 'error',
				'vue/v-on-handler-style': 'error',
				'vue-a11y/label-has-for': [
					'error',
					{
						controlComponents: ['InputText'],
						required: 'id',
					},
				],
			},
		},
		{
			// File naming conventions:
			// - Vue components (.vue): PascalCase (official Nuxt/Vue convention)
			// - Global default remains kebab-case (unicorn default setting)
			files: ['app/components/**/*.vue'],
			rules: {
				'unicorn/filename-case': [
					'error',
					{
						case: 'pascalCase',
					},
				],
			},
		},
		{
			// Composables naming convention:
			// - camelCase with 'use' prefix (Vue 3 Composition API standard)
			// - Example: useComposable.ts
			files: ['app/composables/**/*.ts'],
			rules: {
				'unicorn/filename-case': [
					'error',
					{
						case: 'camelCase',
					},
				],
			},
		},
		{
			files: ['**/*.test.ts'],
			rules: {
				'test/consistent-test-filename': 'error',
				'test/consistent-test-it': ['error', { fn: 'it' }],
				'test/expect-expect': 'error',
				'test/max-expects': 'error',
				'test/max-nested-describe': 'error',
				'test/no-alias-methods': 'error',
				'test/no-commented-out-tests': 'error',
				'test/no-conditional-expect': 'error',
				'test/no-conditional-in-test': 'error',
				'test/no-conditional-tests': 'error',
				'test/no-disabled-tests': 'warn',
				'test/no-duplicate-hooks': 'error',
				'test/no-focused-tests': 'error',
				'test/no-identical-title': 'error',
				'test/no-import-node-test': 'error',
				'test/no-interpolation-in-snapshots': 'error',
				'test/no-large-snapshots': 'error',
				'test/no-mocks-import': 'error',
				'test/no-standalone-expect': 'error',
				'test/no-test-prefixes': 'error',
				'test/no-test-return-statement': 'error',
				'test/padding-around-after-all-blocks': 'error',
				'test/padding-around-after-each-blocks': 'error',
				'test/padding-around-all': 'error',
				'test/padding-around-before-all-blocks': 'error',
				'test/padding-around-before-each-blocks': 'error',
				'test/padding-around-describe-blocks': 'error',
				'test/padding-around-expect-groups': 'error',
				'test/padding-around-test-blocks': 'error',
				'test/prefer-called-with': 'error',
				'test/prefer-comparison-matcher': 'error',
				'test/prefer-each': 'error',
				'test/prefer-equality-matcher': 'error',
				'test/prefer-expect-resolves': 'error',
				'test/prefer-hooks-in-order': 'error',
				'test/prefer-hooks-on-top': 'error',
				'test/prefer-lowercase-title': 'error',
				'test/prefer-mock-promise-shorthand': 'error',
				'test/prefer-snapshot-hint': 'error',
				'test/prefer-spy-on': 'error',
				'test/prefer-strict-boolean-matchers': 'error',
				'test/prefer-strict-equal': 'error',
				'test/prefer-to-be': 'error',
				'test/prefer-to-be-object': 'error',
				'test/prefer-to-contain': 'error',
				'test/prefer-to-have-length': 'error',
				'test/prefer-todo': 'error',
				'test/prefer-vi-mocked': 'error',
				'test/require-local-test-context-for-concurrent-snapshots': 'error',
				'test/require-to-throw-message': 'error',
				'test/require-top-level-describe': ['error', { maxNumberOfTopLevelDescribes: 2 }],
				'test/valid-describe-callback': 'error',
				'test/valid-expect': 'error',
				'test/valid-title': 'error',
				'test/valid-expect-in-promise': 'error',
				'ts/naming-convention': 'off',
				'ts/explicit-function-return-type': 'off',
				'sonarjs/no-nested-functions': 'off',
			},
		},
		{
			files: ['i18n/locales/**.json'],
			rules: {
				'jsonc/sort-keys': 'error',
			},
		},
		{
			files: ['**/*.md', '**/*.mdown'],
			rules: {
				'markdown/fenced-code-language': 'error',
				'markdown/no-empty-links': 'error',
				'markdown/no-invalid-label-refs': 'error',
				'markdown/no-missing-label-refs': 'error',
				'markdown/heading-increment': 'error',
			},
		},
	),
);

/*
These plugins are used by antfu/eslintconfig:
https://github.com/antfu/eslint-config/tree/main/src/configs

Documentation:
https://github.com/antfu/eslint-config

Some of them are renamed to make the overall scope more consistent and easier to write:
https://github.com/antfu/eslint-config?tab=readme-ov-file#plugins-renaming

import/*
node/*
yaml/*
ts/*
style/*
test/*

*/

/*
Other example configurations:

Example project:
https://github.com/joejordan/vite-frontend-template/blob/master/eslint.config.mjs

export default await antfu(
  {
    unocss: false,
    vue: {
      overrides: {
        'vue/no-restricted-syntax': ['error', {
          selector: 'VElement[name=\'a\']',
          message: 'Use NuxtLink instead.',
        }],
      },
    },
    ignores: [
      'public/**',
      'public-dev/**',
      'public-staging/**',
      'https-dev-config/**',
      'elk-translation-status.json',
      'docs/translation-status.json',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
    },
  },
  {
    files: ['locales/**.json'],
    rules: {
      'jsonc/sort-keys': 'error',
    },
  },
)
*/

/*
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    overrides: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
  },
  yaml: {
    overrides: {},
  },
})
*/
