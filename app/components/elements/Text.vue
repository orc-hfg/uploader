<script setup lang="ts">
	// Type scale based on Material UI: https://m3.material.io/styles/typography/type-scale-tokens
	// Additional variants can be added as needed.
	type Variant = 'display-small' | 'headline-medium' | 'headline-small' | 'body-medium';

	type HtmlTag = 'h1' | 'h2' | 'p';

	const { variant, as, class: additionalClasses } = defineProps<{
		variant: Variant;
		as: HtmlTag;
		class?: string;
	}>();

	const VARIANT_CONFIG: Record<Variant, string> = {
		'display-small': 'text-4xl font-medium',
		'headline-medium': 'text-3xl',
		'headline-small': 'text-xl',
		'body-medium': 'text-base',
	};

	const classes = computed(() => {
		const baseClasses = VARIANT_CONFIG[variant];

		return additionalClasses ? `${baseClasses} ${additionalClasses}` : baseClasses;
	});
</script>

<template>
	<component :is="as" :class="classes">
		<slot />
	</component>
</template>
