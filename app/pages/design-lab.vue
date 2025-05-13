<script setup lang="ts">
	import { zodResolver } from '@primevue/forms/resolvers/zod';
	import { useConfirm } from 'primevue/useconfirm';
	import { z } from 'zod';

	// Button Loading
	const loading = ref(false);

	function load() {
		loading.value = true;
		setTimeout(() => {
			loading.value = false;
		}, 2000);
	}

	// SelectButton
	const value = ref('Off');
	const options = ref(['On', 'Off']);

	// Checkbox
	const initialValuesCheckbox = ref({
		ingredient: [],
	});
	const resolverCheckbox = ref(zodResolver(
		z.object({
			ingredient: z.array(z.string()).min(1, { message: 'At least one ingredient must be selected.' }),
		}),
	));

	// Example Form
	const initialValuesBasic = ref({
		username: '',
		email: '',
	});

	const resolverBasic = ref(zodResolver(
		z.object({
			username: z.string().min(1, { message: 'Username is required.' }),
			email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
		}),
	));

	// RadioButtons
	const initialValueRadioButtons = ref({
		ingredient: '',
	});

	const resolverRadioButtons = ref(zodResolver(
		z.object({
			ingredient: z.string().min(1, { message: 'Ingredient is required.' }),
		}),
	));

	// Select / MultiSelect
	const initialValuesMultiSelect = ref({
		city: [],
	});

	const resolverMultiSelect = ref(zodResolver(
		z.object({
			city: z
				.array(
					z.object({
						name: z.string().min(1, 'City is required.'),
					}),
				)
				.min(1, 'City is required.'),
		}),
	));

	const resolverSelect = ref(zodResolver(
		z.object({
			city: z.object({
				name: z.union([
					z.string().min(1, { message: 'City is required.' }),
					z.object({ name: z.string().min(1, { message: 'City is required.' }) }),
				]),
				code: z.string().optional(),
			}),
		}),
	));

	const initialValuesSelect = ref({
		city: { name: '', code: '' },
	});

	const optionsMultiSelect = ref([
		{ name: 'New York', code: 'NY' },
		{ name: 'Rome', code: 'RM' },
		{ name: 'London', code: 'LDN' },
		{ name: 'Istanbul', code: 'IST' },
		{ name: 'Paris', code: 'PRS' },
	]);

	const optionsSelect = ref([
		{ name: 'New York', code: 'NY' },
		{ name: 'Rome', code: 'RM' },
		{ name: 'London', code: 'LDN' },
		{ name: 'Istanbul', code: 'IST' },
		{ name: 'Paris', code: 'PRS' },
	]);

	// DataTable
	const products = ref([{
		id: '1000',
		code: 'f230fh0g3',
		name: 'Bamboo Watch',
		description: 'Product Description',
		image: 'bamboo-watch.jpg',
		price: 65,
		category: 'Accessories',
		quantity: 24,
		inventoryStatus: 'INSTOCK',
		rating: 5,
	},	{
		id: '1001',
		code: 'f230fh0g3',
		name: 'Bamboo Watch 2',
		description: 'Product Description',
		image: 'bamboo-watch.jpg',
		price: 65,
		category: 'Accessories',
		quantity: 24,
		inventoryStatus: 'INSTOCK',
		rating: 5,
	}, {
		id: '1002',
		code: 'f230fh0g3',
		name: 'Bamboo Watch 3',
		description: 'Product Description',
		image: 'bamboo-watch.jpg',
		price: 65,
		category: 'Accessories',
		quantity: 24,
		inventoryStatus: 'INSTOCK',
		rating: 5,
	}]);

	// Menu
	const menu = useTemplateRef('menu');
	const items = ref([
		{
			label: 'Profil',
			items: [
				{
					label: 'Felix Plachtzik',
					icon: 'pi pi-user',
				},
			],
		},
		{
			separator: true,
		},
		{
			label: 'Sprache & Links',
			items: [
				{
					label: 'Sprache',
					icon: 'pi pi-language',
				},
				{
					label: 'zu Madek',
					icon: 'pi pi-external-link',
				},
			],
		},
		{
			separator: true,
		},
		{
			label: 'Aktionen',
			items: [
				{
					label: 'Logout',
					icon: 'pi pi-sign-out',
				},
			],
		},
	]);

	function toggle(event: MouseEvent) {
		if (menu.value) {
			menu.value.toggle(event);
		}
	}

	// ConfirmDialog
	const confirm = useConfirm();

	function confirm1() {
		confirm.require({
			message: 'Are you sure you want to proceed?',
			header: 'Confirmation',
			icon: 'pi pi-exclamation-triangle',
			rejectProps: {
				label: 'Cancel',
				severity: 'secondary',
				outlined: true,
			},
			acceptProps: {
				label: 'Save',
			},
		});
	}

	function confirm2() {
		confirm.require({
			message: 'Do you want to delete this record?',
			header: 'Danger Zone',
			icon: 'pi pi-info-circle',
			rejectLabel: 'Cancel',
			rejectProps: {
				label: 'Cancel',
				severity: 'secondary',
				outlined: true,
			},
			acceptProps: {
				label: 'Delete',
				severity: 'danger',
			},
		});
	}
</script>

<template>
	<div class="pt-8 pb-32 px-4 max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold mb-8">
			Design Lab
		</h1>

		<h2 class="section-heading">
			Button
		</h2>

		<!-- Button -->
		<div class="flex flex-col gap-4">
			<!-- Basic -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Basic / Link: <a href="https://primevue.org/button/#basic">Basic</a>
				</h3>
				<Button label="Basic Button" />
			</div>

			<!-- Icons -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Icons / Link: <a href="https://primevue.org/button/#icons">Icons</a>
				</h3>
				<Button label="Profile" icon="pi pi-user" />
			</div>

			<!-- Loading -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Loading / Link: <a href="https://primevue.org/button/#loading">Loading</a>
				</h3>
				<Button type="button" label="Search" icon="pi pi-search" :loading="loading" @click="load" />
			</div>

			<!-- Disabled -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Disabled / Link: <a href="https://primevue.org/button/#disabled">Disabled</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Submit" disabled />
				</div>
			</div>

			<!-- Severity -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Severity / Link: <a href="https://primevue.org/button/#severity">Severity</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" />
					<Button label="Secondary" severity="secondary" />
					<Button label="Success" severity="success" />
					<Button label="Info" severity="info" />
					<Button label="Warn" severity="warn" />
					<Button label="Help" severity="help" />
					<Button label="Danger" severity="danger" />
					<Button label="Contrast" severity="contrast" />
				</div>
			</div>

			<!-- Rounded -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Rounded / Link: <a href="https://primevue.org/button/#rounded">Rounded</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" rounded />
					<Button label="Secondary" severity="secondary" rounded />
					<Button label="Success" severity="success" rounded />
					<Button label="Info" severity="info" rounded />
					<Button label="Warn" severity="warn" rounded />
					<Button label="Help" severity="help" rounded />
					<Button label="Danger" severity="danger" rounded />
					<Button label="Contrast" severity="contrast" rounded />
				</div>
			</div>

			<!-- Text -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Text / Link: <a href="https://primevue.org/button/#text">Text</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" variant="text" />
					<Button label="Secondary" severity="secondary" variant="text" />
					<Button label="Success" severity="success" variant="text" />
					<Button label="Info" severity="info" variant="text" />
					<Button label="Warn" severity="warn" variant="text" />
					<Button label="Help" severity="help" variant="text" />
					<Button label="Danger" severity="danger" variant="text" />
					<Button label="Contrast" severity="contrast" variant="text" />
				</div>
			</div>

			<!-- Outlined -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Outlined / Link: <a href="https://primevue.org/button/#outlined">Outlined</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" variant="outlined" />
					<Button label="Secondary" severity="secondary" variant="outlined" />
					<Button label="Success" severity="success" variant="outlined" />
					<Button label="Info" severity="info" variant="outlined" />
					<Button label="Warn" severity="warn" variant="outlined" />
					<Button label="Help" severity="help" variant="outlined" />
					<Button label="Danger" severity="danger" variant="outlined" />
					<Button label="Contrast" severity="contrast" variant="outlined" />
				</div>
			</div>

			<!-- Outlined Rounded -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Outlined Rounded
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" variant="outlined" rounded />
					<Button label="Secondary" severity="secondary" variant="outlined" rounded />
					<Button label="Success" severity="success" variant="outlined" rounded />
					<Button label="Info" severity="info" variant="outlined" rounded />
					<Button label="Warn" severity="warn" variant="outlined" rounded />
					<Button label="Danger" severity="danger" variant="outlined" rounded />
					<Button label="Contrast" severity="contrast" variant="outlined" rounded />
				</div>
			</div>

			<!-- Icon only (text) -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Icon Only / Link: <a href="https://primevue.org/button/#icononly">Icon only</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button icon="pi pi-arrow-left" variant="text" rounded aria-label="Back" />
					<Button icon="pi pi-ellipsis-v" severity="secondary" variant="text" rounded aria-label="More" />
					<Button icon="pi pi-search" severity="success" variant="text" rounded aria-label="Search" />
					<Button icon="pi pi-user" severity="info" variant="text" rounded aria-label="User" />
					<Button icon="pi pi-bell" severity="warn" variant="text" rounded aria-label="Notification" />
					<Button icon="pi pi-heart" severity="help" variant="text" rounded aria-label="Favorite" />
					<Button icon="pi pi-times" severity="danger" variant="text" rounded aria-label="Cancel" />
					<Button icon="pi pi-star" severity="contrast" variant="text" rounded aria-label="Star" />
				</div>
			</div>
		</div>

		<h2 class="section-heading">
			Data
		</h2>

		<!-- DataTable -->
		<div class="flex flex-col gap-4">
			<!-- Basic -->
			<div class="variant-group">
				<h3 class="variant-heading">
					DataTable Basic / Link: <a href="https://primevue.org/datatable/#basic">Basic</a>
				</h3>
				<DataTable :value="products" table-style="min-width: 50rem">
					<Column field="code" header="Code" />
					<Column field="name" header="Name" />
					<Column field="category" header="Category" />
					<Column field="quantity" header="Quantity" />
				</DataTable>
			</div>
		</div>

		<h2 class="section-heading">
			Overlay
		</h2>

		<!-- ConfirmDialog -->
		<div class="flex flex-col gap-4">
			<!-- Basic -->
			<div class="variant-group">
				<h3 class="variant-heading">
					ConfirmDialog Basic / Link: <a href="https://primevue.org/confirmdialog/#basic">Basic</a>
				</h3>
				<ConfirmDialog />
				<div class="flex flex-wrap gap-2">
					<Button label="Save" @click="confirm1" />
					<Button label="Delete (secondary, outlined, rounded)" severity="secondary" variant="outlined" rounded @click="confirm2" />
				</div>
			</div>
		</div>

		<h2 class="section-heading">
			Menu
		</h2>

		<!-- Menu -->
		<div class="flex flex-col gap-4">
			<!-- Popup -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Menu Popup / Link: <a href="https://primevue.org/menu/#popup">Popup</a>
				</h3>
				<Menu popup />
				<div class="flex">
					<Button type="button" icon="pi pi-ellipsis-v" severity="secondary" variant="text" rounded aria-label="Menu" aria-haspopup="true" aria-controls="overlay_menu" @click="toggle" />
					<Menu id="overlay_menu" ref="menu" class="mt-2" :model="items" popup />
				</div>
			</div>
		</div>

		<h2 class="section-heading">
			Forms
		</h2>

		<!-- Forms -->
		<div class="flex flex-col gap-4">
			<!-- Example form -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Example form
				</h3>
				<div class="flex">
					<Form v-slot="$form" :resolver="resolverBasic" :initial-values="initialValuesBasic" class="flex flex-col gap-4">
						<div class="flex flex-col gap-1">
							<FloatLabel variant="in">
								<InputText id="in_label" name="username" type="text" variant="filled" />
								<label for="in_label">Username</label>
							</FloatLabel>
							<Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
								{{ $form.username.error?.message }}
							</Message>
						</div>
						<div class="flex flex-col gap-1">
							<FloatLabel variant="in">
								<InputText id="email" name="email" type="text" variant="filled" />
								<label for="email">Email</label>
							</FloatLabel>
							<Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
								{{ $form.email.error?.message }}
							</Message>
						</div>
						<Button type="submit" severity="secondary" label="Submit" />
					</Form>
				</div>
			</div>

			<!-- Checkbox -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Checkbox / Link: <a href="https://primevue.org/checkbox/">PrimeVue Checkbox</a>
				</h3>

				<div class="flex">
					<Form v-slot="$form" :resolver="resolverCheckbox" :initial-values="initialValuesCheckbox" class="flex justify-center flex-col gap-4">
						<div class="flex flex-col gap-2">
							<CheckboxGroup name="ingredient" class="flex flex-wrap gap-4">
								<div class="flex items-center gap-2">
									<Checkbox input-id="cheese" value="Cheese" />
									<label for="cheese"> Cheese </label>
								</div>
								<div class="flex items-center gap-2">
									<Checkbox input-id="mushroom" value="Mushroom" />
									<label for="mushroom"> Mushroom </label>
								</div>
								<div class="flex items-center gap-2">
									<Checkbox input-id="pepper" value="Pepper" />
									<label for="pepper"> Pepper </label>
								</div>
								<div class="flex items-center gap-2">
									<Checkbox input-id="onion" value="Onion" />
									<label for="onion"> Onion </label>
								</div>
							</CheckboxGroup>
							<Message v-if="$form.ingredient?.invalid" severity="error" size="small" variant="simple">
								{{ $form.ingredient.error?.message }}
							</Message>
						</div>
						<Button type="submit" severity="secondary" label="Submit" />
					</Form>
				</div>
			</div>

			<!-- IconField -->
			<div class="variant-group">
				<h3 class="variant-heading">
					IconField / Link: <a href="https://primevue.org/iconfield/">PrimeVue IconField</a>
				</h3>

				<FloatLabel variant="in">
					<IconField>
						<InputIcon class="pi pi-search" />
						<InputText id="in_label" autocomplete="off" variant="filled" />
					</IconField>
					<label for="in_label">In Label</label>
				</FloatLabel>
			</div>

			<!-- InputText -->
			<div class="variant-group">
				<h3 class="variant-heading">
					InputText / Link: <a href="https://primevue.org/inputtext/">PrimeVue InputText</a>
				</h3>

				<FloatLabel variant="in">
					<InputText id="in_label" variant="filled" />
					<label for="in_label">In Label</label>
				</FloatLabel>
			</div>

			<!-- MultiSelect -->
			<div class="variant-group">
				<h3 class="variant-heading">
					MultiSelect / Link: <a href="https://primevue.org/multiselect/">PrimeVue MultiSelect</a>
				</h3>

				<div class="flex">
					<Form v-slot="$form" :resolver="resolverMultiSelect" :initial-values="initialValuesMultiSelect" class="flex justify-center flex-col gap-4">
						<div class="flex flex-col gap-1">
							<MultiSelect name="city" :options="optionsMultiSelect" option-label="name" filter placeholder="Select Cities" :max-selected-labels="3" class="w-full md:w-80" />
							<Message v-if="$form.city?.invalid" severity="error" size="small" variant="simple">
								{{ $form.city.error?.message }}
							</Message>
						</div>
						<Button type="submit" severity="secondary" label="Submit" />
					</Form>
				</div>
			</div>

			<!-- MultiSelect (Chip) -->
			<div class="variant-group">
				<h3 class="variant-heading">
					MultiSelect (Chip) / Link: <a href="https://primevue.org/multiselect/#chips">PrimeVue MultiSelect (Chip)</a>
				</h3>

				<div class="flex">
					<Form v-slot="$form" :resolver="resolverMultiSelect" :initial-values="initialValuesMultiSelect" class="flex justify-center flex-col gap-4">
						<div class="flex flex-col gap-1">
							<MultiSelect name="city" display="chip" :options="optionsMultiSelect" option-label="name" filter placeholder="Select Cities" :max-selected-labels="3" class="w-full md:w-80" />
							<Message v-if="$form.city?.invalid" severity="error" size="small" variant="simple">
								{{ $form.city.error?.message }}
							</Message>
						</div>
						<Button type="submit" severity="secondary" label="Submit" />
					</Form>
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					RadioButton / Link: <a href="https://primevue.org/radiobutton/">PrimeVue RadioButton</a>
				</h3>

				<div class="flex">
					<Form v-slot="$form" :resolver="resolverRadioButtons" :initial-values="initialValueRadioButtons" class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<RadioButtonGroup name="ingredient" class="flex flex-wrap gap-4">
								<div class="flex items-center gap-2">
									<RadioButton input-id="cheese" value="Cheese" variant="filled" />
									<label for="cheese">Cheese</label>
								</div>
								<div class="flex items-center gap-2">
									<RadioButton input-id="mushroom" value="Mushroom" variant="filled" />
									<label for="mushroom">Mushroom</label>
								</div>
								<div class="flex items-center gap-2">
									<RadioButton input-id="pepper" value="Pepper" variant="filled" />
									<label for="pepper">Pepper</label>
								</div>
								<div class="flex items-center gap-2">
									<RadioButton input-id="onion" value="Onion" variant="filled" />
									<label for="onion">Onion</label>
								</div>
							</RadioButtonGroup>
							<Message v-if="$form.ingredient?.invalid" severity="error" size="small" variant="simple">
								{{ $form.ingredient.error?.message }}
							</Message>
						</div>
						<Button type="submit" severity="secondary" label="Submit" />
					</Form>
				</div>
			</div>

			<!-- Select -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Select / Link: <a href="https://primevue.org/select/">PrimeVue Select</a>
				</h3>

				<div class="flex">
					<Form v-slot="$form" :resolver="resolverSelect" :initial-values="initialValuesSelect" class="flex flex-col gap-4 w-full md:w-56">
						<div class="flex flex-col gap-1">
							<!-- eslint-disable-next-line vue-a11y/form-control-has-label -->
							<Select name="city.name" :options="optionsSelect" option-label="name" placeholder="Select a City" fluid />
							<Message v-if="($form.city as any)?.name?.invalid" severity="error" size="small" variant="simple">
								{{ ($form.city as any).name.error?.message }}
							</Message>
						</div>
						<Button type="submit" severity="secondary" label="Submit" />
					</Form>
				</div>
			</div>

			<!-- SelectButton -->
			<div class="variant-group">
				<h3 class="variant-heading">
					SelectButton / Link: <a href="https://primevue.org/selectbutton/">PrimeVue SelectButton</a>
				</h3>

				<div class="flex">
					<SelectButton v-model="value" :options="options" />
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					Textarea / Link: <a href="https://primevue.org/textarea/">PrimeVue Textarea</a>
				</h3>

				<div class="flex">
					<FloatLabel variant="in">
						<!-- eslint-disable-next-line vue/no-static-inline-styles -->
						<Textarea id="over_label" rows="5" cols="30" style="resize: none" />
						<label for="in_label">In Label</label>
					</FloatLabel>
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					ToggleButton / Link: <a href="https://primevue.org/togglebutton/">PrimeVue ToggleButton</a>
				</h3>

				<div class="flex">
					<ToggleButton on-label="On" off-label="Off" />
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					ToggleSwitch / Link: <a href="https://primevue.org/toggleswitch/">PrimeVue ToggleSwitch</a>
				</h3>

				<div class="flex">
					<ToggleSwitch />
				</div>
			</div>
		</div>

		<h2 class="section-heading">
			Misc
		</h2>

		<!-- Chip -->
		<div class="flex flex-col gap-4">
			<div class="variant-group">
				<h3 class="variant-heading">
					Chip Basic / Link: <a href="https://primevue.org/chip/#basic">Chip Basic</a>
				</h3>
				<div class="flex flex-wrap gap-2">
					<Chip label="Action" />
					<Chip label="Comedy" />
					<Chip label="Mystery" />
					<Chip label="Thriller" removable />
				</div>
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
		@apply text-2xl font-bold mt-12 mb-4;
	}
</style>
