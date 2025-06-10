<script setup lang="ts">
	import { themeDesignerVersion } from '@/theme/primevue-theme-designer';
	import { zodResolver } from '@primevue/forms/resolvers/zod';
	import { useConfirm } from 'primevue/useconfirm';
	import { z } from 'zod';

	definePageMeta({
		layout: false,
	});

	defineI18nRoute(false);

	// Button Loading
	const loading = ref(false);

	function load() {
		loading.value = true;
		setTimeout(() => {
			loading.value = false;
		}, 2000);
	}

	// SelectButton
	const selectButtonValue = ref('Off');
	const selectButtonOptions = ref(['On', 'Off']);

	const selectButtonLanguageValue = ref('DE');
	const selectButtonLanguageOptions = ref(['DE', 'EN']);

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
					isLanguageItem: true,
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
	<div class="mx-auto max-w-4xl px-4 pt-8 pb-32">
		<h1 class="mb-8 text-3xl font-bold">
			Design Lab
			<br>
			<small>Theme Designer Version: {{ themeDesignerVersion }}</small>
		</h1>

		<h2 class="section-heading">
			Button (normal size)
		</h2>

		<!-- Button -->
		<div class="flex flex-col gap-4">
			<!-- Basic -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Basic / -> <a href="https://primevue.org/button/#basic">Basic</a>
				</h3>
				<Button label="Basic Button" />
			</div>

			<!-- Icons -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Icons / -> <a href="https://primevue.org/button/#icons">Icons</a>
				</h3>
				<Button label="Profile" icon="pi pi-user" />
			</div>

			<!-- Loading -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Loading / -> <a href="https://primevue.org/button/#loading">Loading</a>
				</h3>
				<Button label="Search" icon="pi pi-search" :loading="loading" @click="load" />
			</div>

			<!-- Disabled -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Disabled / -> <a href="https://primevue.org/button/#disabled">Disabled</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Submit" disabled />
				</div>
			</div>

			<!-- Severity -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Severity / -> <a href="https://primevue.org/button/#severity">Severity</a>
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
					Button Rounded / -> <a href="https://primevue.org/button/#rounded">Rounded</a>
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
					Button Text / -> <a href="https://primevue.org/button/#text">Text</a>
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
					Button Outlined / -> <a href="https://primevue.org/button/#outlined">Outlined</a>
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
					Button Icon Only / -> <a href="https://primevue.org/button/#icononly">Icon only</a>
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
			Button (large size)
		</h2>

		<!-- Button -->
		<div class="flex flex-col gap-4">
			<!-- Basic -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Basic / -> <a href="https://primevue.org/button/#basic">Basic</a>
				</h3>
				<Button label="Basic Button" size="large" />
			</div>

			<!-- Icons -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Icons / -> <a href="https://primevue.org/button/#icons">Icons</a>
				</h3>
				<Button label="Profile" icon="pi pi-user" size="large" />
			</div>

			<!-- Loading -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Loading / -> <a href="https://primevue.org/button/#loading">Loading</a>
				</h3>
				<Button label="Search" icon="pi pi-search" size="large" :loading="loading" @click="load" />
			</div>

			<!-- Disabled -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Disabled / -> <a href="https://primevue.org/button/#disabled">Disabled</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Submit" disabled size="large" />
				</div>
			</div>

			<!-- Severity -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Severity / -> <a href="https://primevue.org/button/#severity">Severity</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" size="large" />
					<Button label="Secondary" severity="secondary" size="large" />
					<Button label="Success" severity="success" size="large" />
					<Button label="Info" severity="info" size="large" />
					<Button label="Warn" severity="warn" size="large" />
					<Button label="Help" severity="help" size="large" />
					<Button label="Danger" severity="danger" size="large" />
					<Button label="Contrast" severity="contrast" size="large" />
				</div>
			</div>

			<!-- Rounded -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Rounded / -> <a href="https://primevue.org/button/#rounded">Rounded</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" rounded size="large" />
					<Button label="Secondary" severity="secondary" rounded size="large" />
					<Button label="Success" severity="success" rounded size="large" />
					<Button label="Info" severity="info" rounded size="large" />
					<Button label="Warn" severity="warn" rounded size="large" />
					<Button label="Help" severity="help" rounded size="large" />
					<Button label="Danger" severity="danger" rounded size="large" />
					<Button label="Contrast" severity="contrast" rounded size="large" />
				</div>
			</div>

			<!-- Text -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Text / -> <a href="https://primevue.org/button/#text">Text</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" variant="text" size="large" />
					<Button label="Secondary" severity="secondary" variant="text" size="large" />
					<Button label="Success" severity="success" variant="text" size="large" />
					<Button label="Info" severity="info" variant="text" size="large" />
					<Button label="Warn" severity="warn" variant="text" size="large" />
					<Button label="Help" severity="help" variant="text" size="large" />
					<Button label="Danger" severity="danger" variant="text" size="large" />
					<Button label="Contrast" severity="contrast" variant="text" size="large" />
				</div>
			</div>

			<!-- Outlined -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Outlined / -> <a href="https://primevue.org/button/#outlined">Outlined</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" variant="outlined" size="large" />
					<Button label="Secondary" severity="secondary" variant="outlined" size="large" />
					<Button label="Success" severity="success" variant="outlined" size="large" />
					<Button label="Info" severity="info" variant="outlined" size="large" />
					<Button label="Warn" severity="warn" variant="outlined" size="large" />
					<Button label="Help" severity="help" variant="outlined" size="large" />
					<Button label="Danger" severity="danger" variant="outlined" size="large" />
					<Button label="Contrast" severity="contrast" variant="outlined" size="large" />
				</div>
			</div>

			<!-- Outlined Rounded -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Outlined Rounded
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button label="Primary" variant="outlined" rounded size="large" />
					<Button label="Secondary" severity="secondary" variant="outlined" rounded size="large" />
					<Button label="Success" severity="success" variant="outlined" rounded size="large" />
					<Button label="Info" severity="info" variant="outlined" rounded size="large" />
					<Button label="Warn" severity="warn" variant="outlined" rounded size="large" />
					<Button label="Danger" severity="danger" variant="outlined" rounded size="large" />
					<Button label="Contrast" severity="contrast" variant="outlined" rounded size="large" />
				</div>
			</div>

			<!-- Icon only (text) -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Button Icon Only / -> <a href="https://primevue.org/button/#icononly">Icon only</a>
				</h3>
				<div class="flex flex-wrap gap-4">
					<Button icon="pi pi-arrow-left" variant="text" rounded size="large" aria-label="Back" />
					<Button icon="pi pi-ellipsis-v" severity="secondary" variant="text" rounded size="large" aria-label="More" />
					<Button icon="pi pi-search" severity="success" variant="text" rounded size="large" aria-label="Search" />
					<Button icon="pi pi-user" severity="info" variant="text" rounded size="large" aria-label="User" />
					<Button icon="pi pi-bell" severity="warn" variant="text" rounded size="large" aria-label="Notification" />
					<Button icon="pi pi-heart" severity="help" variant="text" rounded size="large" aria-label="Favorite" />
					<Button icon="pi pi-times" severity="danger" variant="text" rounded size="large" aria-label="Cancel" />
					<Button icon="pi pi-star" severity="contrast" variant="text" rounded size="large" aria-label="Star" />
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
					DataTable Basic / -> <a href="https://primevue.org/datatable/#basic">Basic</a>
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
			Panel
		</h2>

		<!-- Panel -->
		<div class="flex flex-col gap-4">
			<div class="variant-group">
				<h3 class="variant-heading">
					Accordion Multiple / -> <a href="https://primevue.org/accordion/#multiple">Multiple</a>
				</h3>
				<Accordion :value="['0']" multiple>
					<AccordionPanel value="0">
						<AccordionHeader>Header I</AccordionHeader>
						<AccordionContent>
							<p class="m-0">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
								consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
							</p>
						</AccordionContent>
					</AccordionPanel>
					<AccordionPanel value="1">
						<AccordionHeader>Header II</AccordionHeader>
						<AccordionContent>
							<p class="m-0">
								Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
								ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
							</p>
						</AccordionContent>
					</AccordionPanel>
					<AccordionPanel value="2">
						<AccordionHeader>Header III</AccordionHeader>
						<AccordionContent>
							<p class="m-0">
								At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
								qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
							</p>
						</AccordionContent>
					</AccordionPanel>
				</Accordion>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					Card Advanced / -> <a href="https://primevue.org/card/#advanced">Advanced</a>
				</h3>
				<p class="mb-8 text-primary-600">
					Um den Button auf dem Content zu platzieren kann nicht der Footer-Slot der Card-Komponente (wie hier im Beispiel) verwendet werden.
					Wir müssen dafür alles im Content-Slot platzieren. Zudem passt auch das Standard-Padding nicht für unseren Einsatzweck, denn damit geht das Bild nicht bis zum Rand.
					Vielleicht brauchen wir hier wirklich eine individuelle Komponente, weil die Anpassungen zu umfangreich wären.
				</p>
				<Card>
					<template #content>
						<img
							alt="user header"
							src="https://primefaces.org/cdn/primevue/images/usercard.png"
						>
					</template>
					<template #footer>
						<div class="mt-1 flex justify-end">
							<Button label="Öffnen" icon="pi pi-arrow-right" />
						</div>
					</template>
				</Card>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					ScrollPanel Basic / -> <a href="https://primevue.org/scrollpanel/#basic">Basic</a>
				</h3>
				<!-- eslint-disable-next-line vue/no-static-inline-styles -->
				<ScrollPanel style="width: 100%; height: 200px">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
					<p>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
						voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
					</p>
					<p>
						At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
						officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
					</p>
					<p class="m-0">
						Quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non
						recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat
					</p>
				</ScrollPanel>
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
					ConfirmDialog Basic / -> <a href="https://primevue.org/confirmdialog/#basic">Basic</a>
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
					Menu Basic / -> <a href="https://primevue.org/menu/#basic">Basic</a>
				</h3>
				<div class="flex">
					<Menu
						:model="items" class="
        w-full
        md:w-80
      "
					/>
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					Menu Template / -> <a href="https://primevue.org/menu/#template">Template</a>
				</h3>
				<p class="mb-8 text-primary-600">
					Das Menu Item für die Sprache ist problematisch, da in der Menu-Komponente der Hover auf dem Item immer das gesamte Item kennzeichnet.
				</p>
				<Menu
					:model="items" class="
       w-full
       md:w-80
     "
				>
					<template #item="{ item, props }">
						<template v-if="item.isLanguageItem">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 p-3">
									<span :class="item.icon" />
									<span>{{ item.label }}</span>
								</div>
								<SelectButton v-model="selectButtonLanguageValue" :options="selectButtonLanguageOptions" />
							</div>
						</template>
						<template v-else>
							<a class="flex items-center" v-bind="props.action">
								<span :class="item.icon" />
								<span>{{ item.label }}</span>
							</a>
						</template>
					</template>
				</Menu>
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
					<Form
						v-slot="$form" :resolver="resolverBasic" :initial-values="initialValuesBasic" class="
        flex flex-col gap-4
      "
					>
						<div class="flex flex-col gap-1">
							<FloatLabel variant="in">
								<label for="username">Username</label>
								<InputText id="username" name="username" type="text" variant="filled" />
							</FloatLabel>
							<Message size="small" severity="secondary" variant="simple">
								Enter your username
							</Message>
							<Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
								{{ $form.username.error?.message }}
							</Message>
						</div>
						<div class="flex flex-col gap-1">
							<FloatLabel variant="in">
								<label for="email">Email</label>
								<InputText id="email" name="email" type="text" variant="filled" />
							</FloatLabel>
							<Message size="small" severity="secondary" variant="simple">
								Enter your email
							</Message>
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
					Checkbox Group / -> <a href="https://primevue.org/checkbox/#group">Group</a>
				</h3>

				<div class="flex">
					<Form
						v-slot="$form" :resolver="resolverCheckbox" :initial-values="initialValuesCheckbox" class="
        flex flex-col justify-center gap-4
      "
					>
						<div class="flex flex-col gap-2">
							<CheckboxGroup name="ingredient" class="flex flex-wrap gap-4">
								<div class="flex items-center gap-2">
									<Checkbox input-id="cheesecake" value="Cheese" />
									<label for="cheesecake"> Cheesecake </label>
								</div>
								<div class="flex items-center gap-2">
									<Checkbox input-id="mushroom" value="Mushroom" />
									<label for="mushroom"> Mushroom </label>
								</div>
								<div class="flex items-center gap-2">
									<Checkbox input-id="apple" value="Apple" />
									<label for="apple"> Apple </label>
								</div>
								<div class="flex items-center gap-2">
									<Checkbox input-id="banana" value="Banana" />
									<label for="banana"> Banana </label>
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

			<!-- DatePicker -->
			<div class="variant-group">
				<h3 class="variant-heading">
					DatePicker Basic / -> <a href="https://primevue.org/datepicker/#basic">Basic</a>
				</h3>

				<div class="flex">
					<DatePicker />
				</div>
			</div>

			<!-- IconField -->
			<div class="variant-group">
				<h3 class="variant-heading">
					IconField FloatLabel / -> <a href="https://primevue.org/iconfield/#floatlabel">FloatLabel</a>
				</h3>

				<FloatLabel variant="in">
					<IconField>
						<InputIcon class="pi pi-search" />
						<InputText id="in_label_iconfield" autocomplete="off" variant="filled" />
					</IconField>
					<label for="in_label_iconfield">In Label</label>
				</FloatLabel>
			</div>

			<!-- InputText -->
			<div class="variant-group">
				<h3 class="variant-heading">
					InputText FloatLabel / -> <a href="https://primevue.org/inputtext/#floatlabel">FloatLabel</a>
				</h3>

				<FloatLabel variant="in">
					<InputText id="in_label_inputtext" variant="filled" />
					<label for="in_label_inputtext">In Label</label>
				</FloatLabel>
			</div>

			<!-- MultiSelect -->
			<div class="variant-group">
				<h3 class="variant-heading">
					MultiSelect Forms / -> <a href="https://primevue.org/multiselect/#forms">Forms</a>
				</h3>

				<div class="flex">
					<Form
						v-slot="$form" :resolver="resolverMultiSelect" :initial-values="initialValuesMultiSelect" class="
        flex flex-col justify-center gap-4
      "
					>
						<div class="flex flex-col gap-1">
							<MultiSelect
								name="city" :options="optionsMultiSelect" option-label="name" filter placeholder="Select Cities" :max-selected-labels="3" class="
          w-full
          md:w-80
        "
							/>
							<Message v-if="$form.city?.invalid" severity="error" size="small" variant="simple">
								{{ $form.city.error?.message }}
							</Message>
						</div>
						<Button type="submit" severity="secondary" label="Submit" />
					</Form>
				</div>
			</div>

			<!-- MultiSelect Chips -->
			<div class="variant-group">
				<h3 class="variant-heading">
					MultiSelect Chips / -> <a href="https://primevue.org/multiselect/#chips">Chips</a>
				</h3>

				<div class="flex">
					<MultiSelect
						name="city" display="chip" :options="optionsMultiSelect" option-label="name" filter placeholder="Select Cities" :max-selected-labels="3" class="
        w-full
        md:w-80
      "
					/>
				</div>
			</div>

			<!-- Password -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Password FloatLabel / -> <a href="https://primevue.org/password/#floatlabel">FloatLabel</a>
				</h3>

				<div class="flex">
					<FloatLabel variant="in">
						<Password input-id="password" variant="filled" :feedback="false" />
						<label for="password">Password</label>
					</FloatLabel>
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					RadioButton Forms / -> <a href="https://primevue.org/radiobutton/#forms">Forms</a>
				</h3>

				<div class="flex">
					<Form
						v-slot="$form" :resolver="resolverRadioButtons" :initial-values="initialValueRadioButtons" class="
        flex flex-col gap-4
      "
					>
						<div class="flex flex-col gap-2">
							<RadioButtonGroup name="ingredient" class="flex flex-wrap gap-4">
								<div class="flex items-center gap-2">
									<RadioButton input-id="cheese" value="Cheese" variant="filled" />
									<label for="cheese">Cheese</label>
								</div>
								<div class="flex items-center gap-2">
									<RadioButton input-id="salt" value="Salt" variant="filled" />
									<label for="salt">Salt</label>
								</div>
								<div class="flex items-center gap-2">
									<RadioButton input-id="pepper" value="Pepper" variant="filled" />
									<label for="pepper">Pepper</label>
								</div>
								<div class="flex items-center gap-2">
									<RadioButton input-id="pineapple" value="Pineapple" variant="filled" />
									<label for="pineapple">Pineapple</label>
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
					Select Forms / -> <a href="https://primevue.org/select/#forms">Forms</a>
				</h3>

				<div class="flex">
					<Form
						v-slot="$form" :resolver="resolverSelect" :initial-values="initialValuesSelect" class="
        flex w-full flex-col gap-4
        md:w-56
      "
					>
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
					SelectButton Basic / -> <a href="https://primevue.org/selectbutton/#basic">Basic</a>
				</h3>

				<div class="flex">
					<SelectButton v-model="selectButtonValue" :options="selectButtonOptions" />
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					Textarea FloatLabel / -> <a href="https://primevue.org/textarea/#floatlabel">FloatLabel</a>
				</h3>

				<div class="flex">
					<FloatLabel variant="in">
						<!-- eslint-disable-next-line vue/no-static-inline-styles -->
						<Textarea id="over_label" rows="5" cols="30" style="resize: none" />
						<label for="in_label">In Label</label>
					</FloatLabel>
				</div>
			</div>
		</div>

		<h2 class="section-heading">
			Misc
		</h2>

		<div class="flex flex-col gap-4">
			<div class="variant-group">
				<h3 class="variant-heading">
					Avatar Label / -> <a href="https://primevue.org/avatar/#label">Label</a>
				</h3>
				<div class="flex flex-wrap items-center gap-2">
					<Avatar label="P" class="mr-2" size="xlarge" shape="circle" />
					<Avatar label="P" class="mr-2" size="large" shape="circle" />
					<Avatar label="P" class="mr-2" shape="circle" />
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					Avatar Icon / -> <a href="https://primevue.org/avatar/#icon">Icon</a>
				</h3>
				<div class="flex flex-wrap items-center gap-2">
					<Avatar icon="pi pi-user" class="mr-2" size="xlarge" shape="circle" />
					<Avatar icon="pi pi-user" class="mr-2" size="large" shape="circle" />
					<Avatar icon="pi pi-user" class="mr-2" shape="circle" />
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					Avatar Image / -> <a href="https://primevue.org/avatar/#image">Image</a>
				</h3>
				<div class="flex flex-wrap items-center gap-6">
					<OverlayBadge value="4">
						<Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
					</OverlayBadge>
					<OverlayBadge value="4" severity="secondary">
						<Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
					</OverlayBadge>
					<OverlayBadge value="4" severity="success">
						<Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
					</OverlayBadge>
					<OverlayBadge value="4" severity="info">
						<Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
					</OverlayBadge>
					<OverlayBadge value="4" severity="warn">
						<Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
					</OverlayBadge>
					<OverlayBadge value="4" severity="danger">
						<Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
					</OverlayBadge>
					<OverlayBadge value="4" severity="contrast">
						<Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
					</OverlayBadge>
				</div>
			</div>

			<!-- Badge -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Badge Size / -> <a href="https://primevue.org/badge/#size">Size</a>
				</h3>
				<div class="flex flex-wrap gap-2">
					<Badge value="2" />
					<Badge value="6" severity="secondary" />
					<Badge value="8" severity="success" />
					<Badge value="4" severity="info" />
					<Badge value="9" severity="warn" />
					<Badge value="3" severity="danger" />
					<Badge value="5" severity="contrast" />
				</div>
			</div>

			<div class="variant-group">
				<h3 class="variant-heading">
					Badge Size / -> <a href="https://primevue.org/badge/#size">Size</a>
				</h3>
				<div class="flex flex-wrap gap-2">
					<Badge value="8" size="xlarge" severity="success" />
					<Badge value="6" size="large" severity="warn" />
					<Badge value="4" severity="info" />
					<Badge value="2" size="small" />
				</div>
			</div>

			<!-- Chip -->
			<div class="variant-group">
				<h3 class="variant-heading">
					Chip Basic / -> <a href="https://primevue.org/chip/#basic">Basic</a>
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

<style lang="css" scoped>
	/* See:
		- https://tailwindcss.com/docs/functions-and-directives#reference-directive
		- https://github.com/tailwindlabs/tailwindcss/issues/15717 */
	@reference "@/assets/css/main.css";

	.variant-group {
		@apply p-4 border border-gray-200 rounded-lg;
	}

	.variant-heading {
		@apply text-lg font-semibold mb-4;
	}

	.section-heading {
		@apply text-2xl font-bold mt-12 mb-4;
	}
</style>
