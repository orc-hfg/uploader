# TypeScript-Richtlinien

## Allgemeine Prinzipien

- **Keine `any`-Typen** verwenden - Dies verbessert die Typsicherheit und Codequalität
- **Keine Typ-Assertions** (`as Type`) verwenden - Bevorzuge explizite Typprüfung und frühe Returns
- **Typsicherheit bevorzugen** - Verwende explizite Typdefinitionen statt Inferenz, wo sinnvoll

## Alternativen zu `any`

- **Spezifische Typdefinitionen** - Erstelle eigene Interfaces oder Types
- **Interface-Deklarationen** - Für komplexere Objekte
- **Typinferenz** (z.B. mit `z.infer<typeof schema>` bei Verwendung von Zod)
- **`unknown`** - Wenn der Typ wirklich nicht bekannt ist (sicherer als `any`)
- **Generics** - Für flexible, aber typsichere Implementierungen
- **Type Guards** und Type Narrowing - Um Typen einzugrenzen

## Bessere Alternativen zu Typ-Assertions

```typescript
// VERMEIDEN:
return doStringThing(someValue as string);

// BEVORZUGEN:
const value = someValue;
if (typeof value === 'string') {
  // Value als String verwenden
  return doStringThing(value);
}
return defaultBehavior();
```

## TypeScript mit ESLint und Nuxt

### Nuxt Auto-Imports und Konfigurationsdateien

Bei Nuxt-Konfigurationsdateien (wie Sentry), die nicht in der Haupt-tsconfig.json definiert sind:

**Pragmatische Lösung:**
- **Lokale Typdeklarationen** für Auto-Imports hinzufügen:
  ```typescript
  // Für useRuntimeConfig
  declare function useRuntimeConfig(): {
    public: {
      // Relevante Eigenschaften hier definieren
    }
  };
  ```
- **Keine expliziten Imports** verwenden - weder aus '#imports' noch aus 'nuxt/app'
- Konfigurationsdateien in der **ESLint-Ignore-Liste** belassen

### Nuxt 4 TypeScript-Konfiguration

Das Projekt nutzt Nuxt 4's TypeScript-Konfiguration-Splitting mit separaten tsconfig-Dateien für verschiedene Kontexte:

```json
{
	// https://nuxt.com/docs/guide/concepts/typescript
	"references": [
		{ "path": "./.nuxt/tsconfig.app.json" },
		{ "path": "./.nuxt/tsconfig.server.json" },
		{ "path": "./.nuxt/tsconfig.shared.json" },
		{ "path": "./.nuxt/tsconfig.node.json" }
	],
	"files": []
}
```

**Kontext-spezifische Konfigurationen:**

#### **shared/** (`tsconfig.shared.json`)
- **Framework-agnostic**: Kein Zugriff auf Nuxt-spezifische APIs
- **`"types": []`**: Keine globalen Auto-Imports verfügbar
- **Verfügbare Aliases**: `#shared/*`, aber **nicht** `#app` (führt zu TypeScript-Fehlern)
- **Zweck**: Wiederverwendbare Utilities, die in allen Kontexten funktionieren

#### **server/** (`tsconfig.server.json`)
- **Server-Kontext**: H3Event-Zugriff, `useRuntimeConfig(event)`
- **Auto-Imports**: `#imports` → `./types/nitro-imports` (Server-spezifische APIs)
- **Shared-Zugriff**: `#shared/*` verfügbar für geteilte Utilities
- **APIs**: Nitro, H3, Webworker (aber kein volles DOM)
- **Include**: `../server/**/*`, `../shared/**/*.d.ts`

#### **app/** (`tsconfig.app.json`)
- **Client-Kontext**: Vue-Composables, `useRuntimeConfig()`
- **Auto-Imports**: `#imports` → `./imports` (Client-spezifische APIs)
- **Nuxt-App-APIs**: `#app/*` verfügbar für App-spezifische Funktionen
- **Shared-Zugriff**: `#shared/*` verfügbar für geteilte Utilities
- **Browser-APIs**: Vollzugriff auf DOM, Webworker, Client-side Navigation
- **Include**: `../app/**/*`, `../shared/**/*.d.ts` | **Exclude**: `../server`

#### **node/** (`tsconfig.node.json`)
- **Build-Zeit**: Nuxt-Konfiguration, Module und Build-Tools
- **Umfasst**: `nuxt.config.*`, Module-Definitionen, Layer-Konfigurationen
- **Ausgeschlossen**: Runtime-Code (`app/`, `server/`, `modules/*/runtime/`)

## Props in Vue-Komponenten

```typescript
// BEVORZUGEN: Direkte Destrukturierung mit Default-Zuweisung
const { propName = defaultValue } = defineProps<{
  propName?: propType;
}>();

// VERMEIDEN: withDefaults
const props = withDefaults(defineProps<{
  propName?: propType;
}>(), {
  propName: defaultValue
});
```
