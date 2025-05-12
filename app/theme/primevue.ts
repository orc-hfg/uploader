import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const preset = definePreset(Aura, {
	primitive: {
		emerald: {
			50: '#FFF1EB',
			100: '#FFDBCC',
			200: '#FFB899',
			300: '#FF8957',
			400: '#FF621F',
			500: '#FF4D00',
			600: '#E54500',
			700: '#762604',
			800: '#602106',
			900: '#4B1B06',
			950: '#2E0E00',
		},
		red: {
			50: '#FFF1EB',
			100: '#FFDBCC',
			200: '#FFB899',
			300: '#FF8957',
			400: '#FF621F',
			500: '#FF4D00',
			600: '#E54500',
			700: '#762604',
			800: '#602106',
			900: '#4B1B06',
			950: '#2E0E00',
		},
		slate: {
			50: '#F7F7F7',
			100: '#EFEEEC',
			200: '#E8E7E3',
			300: '#E1E1DA',
			400: '#CBCAC3',
			500: '#B3B2AD',
			600: '#6D6C64',
			700: '#444440',
			800: '#2C2A2A',
			900: '#1C1C1C',
			950: '#0D0D0D',
		},
	},
	semantic: {
		colorScheme: {
			light: {
				primary: {
					activeColor: '{primary.600}',
				},
				formField: {
					background: '{surface.50}',
					borderColor: '{surface.50}',
					hoverBorderColor: '{surface.300}',
					focusBorderColor: '{surface.300}',
					color: '{surface.800}',
					floatLabelFocusColor: '{surface.500}',
				},
			},
		},
		components: {
			button: {
				colorScheme: {
					light: {
						contrast: {
							background: '{surface.900}',
							hoverBackground: '{surface.950}',
							activeBackground: '{surface.950}',
							activeBorderColor: '{surface.950}',
						},
						outlined: {
							secondary: {
								color: '{surface.900}',
							},
						},
					},
				},
			},
			radiobutton: {
				root: {
					borderColor: '{surface.300}',
				},
			},
		},
	},
});

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
