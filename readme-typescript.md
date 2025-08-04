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
