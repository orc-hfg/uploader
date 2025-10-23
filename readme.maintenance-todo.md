# Aufgaben für den neuen Stand nach dem Dependency Update

- Accessibility-Probleme mit PrimeVue:
  - https://github.com/primefaces/primevue/issues/8210
  - https://github.com/primefaces/primevue/issues/8178
  - Nach "TODO: Remove this exclusion after PrimeVue updates - check if fixed in new versions" suchen und `.exclude('#password_label')` sowie den Kommentar entfernen, wenn möglich
- Wenn ein neues Update von `@nuxt/test-utils` vorhanden ist, sind dann auch folgende Updates möglich?
  - Update von `happy-dom` auf Version > 18
  - Update von `vitest` auf Version > 4
- Kann `"vitest": false` aus `knip.json` wieder entfernt werden? Läuft dann `npm run check:unused` fehlerfrei?
