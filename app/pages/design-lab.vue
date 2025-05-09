<script setup lang="ts">
	interface City {
		name: string;
		code: string;
	}

	const cities = ref<City[]>([
		{ name: 'Berlin', code: 'BER' },
		{ name: 'München', code: 'MUC' },
		{ name: 'Hamburg', code: 'HAM' },
		{ name: 'Frankfurt', code: 'FRA' },
		{ name: 'Köln', code: 'CGN' },
	]);

	const selectedCities = ref<City[]>();
</script>

<template>
	<div class="pt-8 pb-32 px-4 max-w-3xl mx-auto">
		<h1 class="text-3xl font-bold mb-8">
			Design Lab
		</h1>

		<h2 class="section-heading">
			Button Variants
		</h2>

		<!-- Button Variants -->
		<div class="grid grid-cols-1 gap-4 mb-12">
			<!-- Primary Button -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Primary
				</h3>
				<Button label="Primary Button" />
			</div>

			<!-- Contrast Rounded -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Contrast Rounded
				</h3>
				<Button label="Contrast Rounded" severity="contrast" rounded />
			</div>

			<!-- Secondary Outlined Rounded -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Secondary Outlined Rounded
				</h3>
				<Button label="Secondary Outlined Rounded" severity="secondary" outlined rounded />
			</div>

			<!-- Secondary Text -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Secondary Text
				</h3>
				<Button label="Secondary Text" severity="secondary" text />
			</div>

			<!-- Plain Outlined Rounded -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Plain Outlined Rounded
				</h3>
				<Button label="Plain Outlined Rounded" severity="plain" outlined rounded />
			</div>
		</div>

		<!-- Input Variants -->
		<h2 class="section-heading mt-12">
			Input Variants
		</h2>

		<div class="grid grid-cols-1 gap-4">
			<!-- Standard Input -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Standard Input
				</h3>
				<InputText placeholder="Standard input" />
			</div>

			<!-- Disabled Input -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Disabled Input
				</h3>
				<InputText placeholder="Disabled input" disabled />
			</div>

			<!-- Input with Icon -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Input with Icon
				</h3>
				<InputText placeholder="Search with icon" class="pl-8 relative" />
				<i class="pi pi-search absolute -translate-y-[34px] left-7" />
			</div>

			<!-- Multi Select -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Multi Select
				</h3>
				<MultiSelect
					v-model="selectedCities"
					:options="cities"
					option-label="name"
					placeholder="Select Cities"
					display="chip"
					class="w-full md:w-80"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
	@reference "@/assets/css/main.css";

	.variant-group {
		@apply p-4 border border-gray-200 rounded-lg;
	}

	.variant-heading {
		@apply text-lg font-semibold mb-2;
	}

	.section-heading {
		@apply text-2xl font-bold mb-4;
	}
</style>
