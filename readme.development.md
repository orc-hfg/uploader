# Entwicklung

## Entwicklung mit dem madek-api-nuxt-layer (lokales Linking)

Damit Änderungen am Nuxt-Layer lokal entwickelt und getestet werden können, ohne jedes Mal eine neue Version zu veröffentlichen, empfiehlt sich das Vorgehen über `npm link` (https://docs.npmjs.com/cli/v9/commands/npm-link):

### 1. Zum Layer-Projekt wechseln

In den Ordner des Nuxt-Layers wechseln (z.B. madek-api-nuxt-layer) und das Package global per Symlink verlinken:

```bash
cd /pfad/zu/madek-api-nuxt-layer
npm link
```

### 2. Link im Hauptprojekt aktivieren

In das Hauptprojekt wechseln (z.B. Ordner dieses Repositories):

```bash
cd /pfad/zum/hauptprojekt
npm link @orc-hfg/madek-api-nuxt-layer
```

Jetzt wird der lokal verlinkte Nuxt-Layer (aus Schritt 1) anstelle der in der package.json angegebenen (veröffentlichten) Version verwendet.

**Hinweis:** Im Hauptprojekt stehen zwei Skripte in der `package.json` bereit, damit die Link/Unlink-Befehle nicht manuell eingegeben werden müssen:
- Link aktivieren: `npm run madek-api-nuxt-layer:link`
Das führt intern `npm link @orc-hfg/madek-api-nuxt-layer` aus.

- Link auflösen: `npm run madek-api-nuxt-layer:unlink`
Dabei werden der Symlink entfernt und anschließend automatisch wieder die reguläre (publizierte) Paketversion installiert.

### 3. Lokale Entwicklung

Jetzt kann wie gewohnt am Layer-Projekt gearbeitet werden. Werden Dateien geändert, wird das Hauptprojekt beim nächsten Start/Neubau mit den aktualisierten Layer-Dateien versorgt.
Damit die Änderungen im Hauptprojekt wirksam werden, muss ggf. der Dev-Server neu gestartet bzw. auf HMR (Hot Module Replacement) gewartet werden.

### 4. Linking wieder auflösen (optional)

Wenn wieder die offizielle (z.B. auf npm oder Git referenzierte) Version verwenden werden soll:

- im Hauptprojekt das Skript `npm run madek-api-nuxt-layer:unlink` ausführen
- oder `npm install` im Hauptprojekt ausführen, dabei wird der Link automatisch aufgelöst

## Wichtige Entwicklungsprinzipien

- **Early Returns** bevorzugen - für bessere Code-Verständlichkeit und weniger verschachtelte Strukturen
- **Hoher Wert auf Code-Verständlichkeit** - klare, lesbare und gut strukturierte Implementierungen haben Priorität
- **Vollständige Variablennamen** bevorzugen (z.B. "Development" statt "Dev", "Application" statt "App")
- **KISS-Prinzip** - Nach einfachen, direkten Lösungen suchen, bevor komplexe Abstraktionen verwendet werden
- **Keine `any`-Typen** in TypeScript - Verwende spezifische Typdefinitionen, Interface-Deklarationen oder `unknown`
- **Keine Typ-Assertions** (`as Type`) - Bevorzuge explizite Typprüfung mit `typeof` und Bedingungen
- **Alle Codekommentare in Englisch** schreiben - unabhängig von der Sprache der Projektdokumentation

### Nuxt-spezifische Richtlinien

- **Auto-Imports** - Nuxt importiert automatisch mehrere Vue-Features (ref, computed, watch, etc.)
- **Kein manueller Import von `useI18n()`** - Direkt verwenden, ohne Import
- **In Vue-Templates die globale `$t`-Funktion verwenden** statt der aus `useI18n()` extrahierten `t`-Funktion

## Logging Guidelines

#### App Logger (Client-Side)
```typescript
// Logger erstellen mit Source im Konstruktor
const appLogger = createAppLogger('Page: projects');

// Verwenden ohne Source-Parameter
appLogger.info('User logged in successfully');
appLogger.error('Login failed', error);
appLogger.debug('Debug information', debugData);
```

#### Server Logger (Server-Side)

**Server Request Logger** - für Request Handler (mit H3Event):
```typescript
// In API routes (server/api/*.ts) oder anderen Request Handlers
export default defineEventHandler(async (event) => {
	const serverLogger = createServerLogger(event, 'API: /auth/sign-in');
	serverLogger.error('Authentication failed', error);
	serverLogger.info('Request processed successfully');
});
```

**Server Startup Logger** - für Plugins und Initialization:
```typescript
// In Server Plugins (server/plugins/*.ts)
const serverStartupLogger = createServerStartupLogger('Plugin: authentication-mock');
serverStartupLogger.info('Authentication mock is active.');
```

#### E2E Test Logger
```typescript
// Nur für E2E-Tests verwenden - NICHT im Hauptcode!
const testLogger = createTestLogger('Test: authentication');
testLogger.warn('Test warning message');
```

### Wichtige Unterschiede

**Server Request vs. Startup Logger:**
- **Request Logger**: Benötigt H3Event, wird in API routes und Request Handlers verwendet
- **Startup Logger**: Kein H3Event verfügbar, wird in Server Plugins während der Initialisierung verwendet

**Warum zwei Server Logger?**
Server Plugins laufen während des Server-Starts, nicht während individueller Requests. Sie haben keinen Zugriff auf H3Event und müssen `useRuntimeConfig()` ohne Event-Parameter aufrufen.

**Wichtig:** Der E2E Test Logger sollte niemals im Hauptanwendungscode verwendet werden!
