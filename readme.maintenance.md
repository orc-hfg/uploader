# Wartung und Dependency Updates

## Node-Version aktualisieren

Die Node-Version sollte regelmäßig auf die aktuelle LTS-Version aktualisiert werden:

### Node-LTS-Version herausfinden

Per Skript:
- `npm run check:node`

Manuell:
- `nvm ls-remote --lts | tail -n 1` ausführen
- Falls der Node Version Manager (`nvm`) nicht verfügbar ist, hier nachschauen: https://github.com/nodejs/Release?tab=readme-ov-file#release-schedule

### Aktualisierungsprozess

Folgende Dateien entsprechend anpassen:
- `.nvmrc`
- `package.json` im Abschnitt "engines"
- `nvm use && npm install` ausführen, damit die definierte Node-Version (`.nvmrc`) in der aktuellen Shell aktiviert wird und die Abhängigkeiten für diese installiert werden (`package-lock.json`)

## Externe Abhängigkeiten aktualisieren

- `npm run upgrade` ausführen, um Nuxt zu updaten.
- `npm run check-updates` verwenden, Updates installieren und währenddessen immer wieder die Funktionalität testen.

## Bekannte Issues und Workarounds

### Nuxt i18n v10 und SwitchLocalePathLink

Bei der Verwendung von Nuxt i18n v10 mit einer benutzerdefinierten baseURL-Konfiguration kann die `SwitchLocalePathLink`-Komponente Hydration Mismatches verursachen, da sie unterschiedliche URLs auf dem Server vs. Client generiert:

- Server rendert: `href="/de/anmeldung"`
- Client erwartet: `href="/uploader/de/anmeldung"`

**Lösung**: `SwitchLocalePathLink` durch eine direkte Kombination von `useSwitchLocalePath()` und `NuxtLink` ersetzen:

```vue
<script setup>
// Composable verwenden
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <!-- Statt diesem (verursacht Hydration Mismatch): -->
  <!-- <SwitchLocalePathLink locale="en">English</SwitchLocalePathLink> -->
  
  <!-- Lieber das verwenden (funktioniert korrekt): -->
  <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
</template>
```

### Lokalisierte Routen in Nuxt i18n

Es gibt zwei Möglichkeiten, lokalisierte Routen in Nuxt i18n zu definieren:

1. **Klassische Methode mit `defineI18nRoute`**:
   ```typescript
   defineI18nRoute({
     paths: {
       de: '/projekte',
       en: '/projects',
     },
   });
   ```

2. **Neue Methode mit `i18n` in `definePageMeta`** (ab Nuxt i18n v10):
   ```typescript
   definePageMeta({
     i18n: {
       paths: {
         de: '/projekte',
         en: '/projects',
       },
     },
   });
   ```

**Problem**: Die neue Methode mit `definePageMeta` hat Kompatibilitätsprobleme mit anderen Metadaten wie `pageTransition` und `middleware`. Wenn beide zusammen verwendet werden, funktioniert die i18n-Konfiguration nicht korrekt.

**Lösung**: Weiterhin die klassische `defineI18nRoute`-Methode verwenden, bis diese Probleme in einer zukünftigen Version (wahrscheinlich Nuxt i18n v11) behoben sind.

### Nuxt Auto-Imports in TypeScript-Konfigurationsdateien

Bei der Verwendung von Nuxt Auto-Imports in Dateien, die nicht in der Haupt-tsconfig.json definiert sind, gibt es folgende bewährte Vorgehensweise:

1. **Lokale Typdeklarationen für alle Auto-Imports hinzufügen:**
   ```typescript
   // Für useRuntimeConfig
   declare function useRuntimeConfig(): {
     public: {
       // Relevante Eigenschaften hier definieren
     }
   };
   
   // Für andere Auto-Imports wie usePinia
   declare function usePinia(): any;
   ```

2. **Keine expliziten Imports verwenden:**
   - Keine Imports aus '#imports' (funktioniert nicht mit separaten tsconfig-Dateien)
   - Keine Imports aus 'nuxt/app' (verursacht Runtime-Fehler im Server-Kontext)

### Verwendung von `import.meta` in Nuxt

`import.meta` sollte nur dort verwendet werden, wo es verfügbar ist:

**✅ Wo import.meta verfügbar ist:**
- Nuxt App Code (components, pages, plugins, middleware)
- `nuxt.config.ts` (BUILD-ZEIT)
- Server-side Code (API routes, server plugins) - aber VORSICHT bei Environment-Variablen
- Nitro Plugins

**❌ Wo import.meta NICHT verfügbar ist:**
- Playwright Config (`playwright.config.ts`)
- Node.js Scripts (`.mjs` files)
- Andere Config-Dateien außerhalb des Nuxt-Kontexts
