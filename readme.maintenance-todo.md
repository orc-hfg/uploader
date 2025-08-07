# Aufgaben für den neuen Stand nach dem Dependency Update

- Kann `"vitest": false` aus `knip.json` wieder entfernt werden? Läuft dann `npm run check:unused` fehlerfrei?
- `@nuxtjs/i18n > v10.0.3`: Gibt es weiterhin die Hydration Mismatches bei Verwendung von `SwitchLocalePathLink` (`app/components/Header.vue`)?
	```vue
	<SwitchLocalePathLink locale="de">Deutsch</SwitchLocalePathLink>

	const switchLocalePath = useSwitchLocalePath();
	<NuxtLink :to="switchLocalePath('de')">Deutsch</NuxtLink>
	```
- Kann Dependency `@primevue/forms` wieder entfernt werden? Also ist dieses Problem gelöst (zum Test auf Seite mit Formularelementen wechseln und Logs in CLI anschauen)? https://github.com/primefaces/primevue/issues/7434
