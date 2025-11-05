# Aufgaben für den neuen Stand nach dem Dependency Update

- Accessibility-Probleme mit PrimeVue:
  - https://github.com/primefaces/primevue/issues/8210
  - https://github.com/primefaces/primevue/issues/8178
  - Nach "TODO: Remove this exclusion after PrimeVue updates - check if fixed in new versions" suchen und `.exclude('#password_label')` sowie den Kommentar entfernen, wenn möglich
- Wenn ein neues Update von `@nuxt/test-utils` vorhanden ist, sind dann auch folgende Updates möglich?
  - Update von `happy-dom` auf Version > 18
  - Update von `vitest` auf Version > 4
  - https://github.com/nuxt/test-utils/issues/1452
    - **Stand 04.11.2025**: Update auf `vitest@4.0.7` nicht möglich wegen Peer-Dependency-Konflikt
    - `@nuxt/test-utils@3.20.1` benötigt `vitest@^3.2.0`
    - Aktuell blockiert bei `vitest@3.2.4`
    - Warten auf Update von `@nuxt/test-utils` mit Vitest 4-Unterstützung-
- Nuxt i18n Route-Definition:
  - Bei Upgrade `@nuxtjs/i18n` auf Version > 10.2.0 prüfen, ob die Kompatibilitätsprobleme mit `definePageMeta({ i18n: { paths: {...} } })` behoben wurden
  - Wenn ja, von der klassischen `defineI18nRoute`-Methode zur neuen Methode wechseln
  - Siehe Kommentar in `nuxt.config.ts` (Zeilen 72-92) für Details
  - Betroffene Dateien: Alle Pages mit lokalisierten Routen
