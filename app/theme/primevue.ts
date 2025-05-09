import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const preset = definePreset(Aura, {});

export default {
	preset,
	options: {
		prefix: 'p',
		// If necessary, align Tailwind CSS settings with PrimeVue for Dark Mode: https://primevue.org/tailwind/#darkmode
		darkModeSelector: false,
		// See: https://primevue.org/tailwind/#override
		cssLayer: {
			name: 'primevue',
			order: 'theme, base, primevue',
		},
	},
};
