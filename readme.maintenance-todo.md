# Aufgaben für den neuen Stand nach dem Dependency Update

- Kann `"vitest": false` aus `knip.json` wieder entfernt werden? Läuft dann `npm run check:unused` fehlerfrei?
- `@nuxtjs/i18n > v10.0.6`: Gibt es weiterhin die Hydration Mismatches bei Verwendung von `SwitchLocalePathLink` (`app/components/Header.vue`) ohne Verwendung von ClientOnly?
	```vue
			<ClientOnly>
				<SwitchLocalePathLink locale="de">
					Deutsch
				</SwitchLocalePathLink>
			</ClientOnly>

			vs.

			<SwitchLocalePathLink locale="de">
				Deutsch
			</SwitchLocalePathLink>
	```
