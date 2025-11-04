# Aufgaben für den neuen Stand nach dem Dependency Update

- Update von `@vueuse/nuxt` auf Version > 14.0.0
  - funktioniert `npm run build` nun fehlerfrei ohne RollupError (useMediaQuery)?
- Accessibility-Probleme mit PrimeVue:
  - https://github.com/primefaces/primevue/issues/8210
  - https://github.com/primefaces/primevue/issues/8178
  - Nach "TODO: Remove this exclusion after PrimeVue updates - check if fixed in new versions" suchen und `.exclude('#password_label')` sowie den Kommentar entfernen, wenn möglich
- Wenn ein neues Update von `@nuxt/test-utils` vorhanden ist, sind dann auch folgende Updates möglich?
  - Update von `happy-dom` auf Version > 18
  - Update von `vitest` auf Version > 4
  - https://github.com/nuxt/test-utils/issues/1452
- Nuxt i18n Route-Definition:
  - Bei Upgrade `@nuxtjs/i18n` auf Version > 10 prüfen, ob die Kompatibilitätsprobleme mit `definePageMeta({ i18n: { paths: {...} } })` behoben wurden
  - Wenn ja, von der klassischen `defineI18nRoute`-Methode zur neuen Methode wechseln
  - Siehe Kommentar in `nuxt.config.ts` (Zeilen 72-92) für Details
  - Betroffene Dateien: Alle Pages mit lokalisierten Routen
