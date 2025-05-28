<script lang="ts" setup>
	definePageMeta({
		pageTransition: {
			name: 'slide-left',
		},
		middleware: 'page-transition',
	});
</script>

<template>
	<div class="h-full">
		<div class="text-2xl font-bold bg-primary-100 text-primary-50 p-4 h-full">
			Projects<br>
			<NuxtLink to="/">
				Login
			</NuxtLink>
		</div>
	</div>
</template>
