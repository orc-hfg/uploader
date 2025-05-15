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
			lg: {
				paddingX: '0.6rem',
				paddingY: '0.3rem',
			},
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
				shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.0)',
			},
			modal: {
				borderRadius: '{border.radius.none}',
				shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.0)',
			},
		},
		colorScheme: {
			light: {
				primary: {
					activeColor: '{primary.600}',
				},
				highlight: {
					background: '{primary.500}',
					focusBackground: '{primary.600}',
					color: '{primary.contrast}',
					focusColor: '{primary.50}',
				},
				formField: {
					background: '{surface.50}',
					borderColor: '{surface.50}',
					hoverBorderColor: '{surface.300}',
					focusBorderColor: '{surface.300}',
					color: '{surface.800}',
					floatLabelFocusColor: '{surface.500}',
					shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.00)',
				},
				text: {
					color: '{surface.900}',
					hoverColor: '{surface.950}',
				},
				content: {
					borderColor: '{surface.400}',
				},
				overlay: {
					select: {
						background: '{surface.0}',
						borderColor: '{surface.0}',
					},
					popover: {
						borderColor: '{surface.400}',
					},
					modal: {
						borderColor: '{surface.400}',
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
			badge: {
				root: {
					fontWeight: '500',
				},
				colorScheme: {
					light: {
						secondary: {
							background: '{surface.50}',
							color: '{surface.900}',
						},
						warn: {
							background: '{primary.color}',
						},
					},
				},
			},
			button: {
				root: {
					lg: {
						fontSize: '1.25rem',
					},
				},
				colorScheme: {
					light: {
						root: {
							secondary: {
								background: '{surface.50}',
								hoverBackground: '{surface.100}',
								activeBackground: '{surface.200}',
								borderColor: '{surface.500}',
								hoverBorderColor: '{surface.100}',
								activeBorderColor: '{surface.200}',
								color: '{surface.900}',
								hoverColor: '{surface.950}',
								activeColor: '{surface.9500}',
							},
							warn: {
								background: '{primary.color}',
								hoverBackground: '{primary.hover.color}',
								activeBackground: '{primary.active.color}',
								borderColor: '{primary.color}',
								hoverBorderColor: '{primary.hover.color}',
								activeBorderColor: '{primary.active.color}',
								focusRing: {
									color: '{primary.color}',
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
							primary: {
								borderColor: '{primary.500}',
							},
							secondary: {
								hoverBackground: '{surface.100}',
								activeBackground: '{surface.200}',
								borderColor: '{surface.400}',
								color: '{surface.900}',
							},
						},
						text: {
							secondary: {
								hoverBackground: '{surface.100}',
								activeBackground: '{surface.200}',
								color: '{surface.900}',
							},
						},
					},
				},
			},
			checkbox: {
				root: {
					borderColor: '{surface.300}',
				},
			},
			chip: {
				root: {
					borderRadius: '2rem',
				},
				colorScheme: {
					light: {
						root: {
							color: '{surface.900}',
						},
						icon: {
							color: '{surface.900}',
						},
						removeIcon: {
							color: '{surface.900}',
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
				content: {
					checkedShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.00), 0px 1px 2px 0px rgba(0, 0, 0, 0.00)',
				},
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
