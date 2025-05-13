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
		formField: {
			borderRadius: '{border.radius.none}',
		},
		content: {
			borderRadius: '{border.radius.none}',
		},
		overlay: {
			select: {
				borderRadius: '{border.radius.none}',
			},
			popover: {
				borderRadius: '{border.radius.none}',
			},
			modal: {
				borderRadius: '{border.radius.none}',
			},
		},
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
				text: {
					color: '{surface.800}',
					hoverColor: '{surface.900}',
				},
				overlay: {
					select: {
						background: '{surface.50}',
						borderColor: '{surface.50}',
					},
				},
				navigation: {
					item: {
						icon: {
							color: '{text.color}',
							focusColor: '{text.color}',
							activeColor: '{text.color}',
						},
					},
				},
			},
		},
		components: {
			button: {
				colorScheme: {
					light: {
						root: {
							warn: {
								background: '{emerald.500}',
								hoverBackground: '{emerald.600}',
								activeBackground: '{emerald.600}',
								borderColor: '{emerald.500}',
								hoverBorderColor: '{emerald.600}',
								activeBorderColor: '{emerald.700}',
								focusRing: {
									color: '{emerald.500}',
								},
							},
							contrast: {
								background: '{surface.900}',
								hoverBackground: '{surface.950}',
								activeBackground: '{surface.950}',
								activeBorderColor: '{surface.950}',
							},
						},
						outlined: {
							secondary: {
								color: '{surface.900}',
							},
						},
						text: {
							secondary: {
								color: '{surface.900}',
							},
						},
					},
				},
			},
			multiselect: {
				dropdown: {
					color: '{surface.950}',
				},
			},
			radiobutton: {
				root: {
					borderColor: '{surface.300}',
				},
			},
			togglebutton: {
				colorScheme: {
					light: {
						root: {
							checkedColor: '{surface.0}',
							checkedBorderColor: '{primary.500}',
						},
						content: {
							checkedBackground: '{primary.500}',
						},
					},
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
