# Entwicklung

## Entwicklung mit dem madek-api-nuxt-layer (lokales Linking)

Damit Änderungen am Nuxt-Layer lokal entwickelt und getestet werden können, ohne jedes Mal eine neue Version zu veröffentlichen, empfiehlt sich das Vorgehen über `npm link` (https://docs.npmjs.com/cli/v9/commands/npm-link):

### Schnellstartmethode (Empfohlen)

**Für parallele Entwicklung mit dem Hauptprojekt:**

1. **Im Layer-Repository** (madek-api-nuxt-layer):
   ```bash
   npm run link:dev
   ```
   Das verlinkt den Layer global und startet den Development-Server (Port 3001).

2. **Im Hauptprojekt** (z.B. Uploader):
   ```bash
   npm run link:dev
   ```
   Das verlinkt das Hauptprojekt mit dem Layer und startet ebenfalls den Development-Server.

**Wichtig:** Beide Development-Server müssen parallel laufen, damit Live-Updates funktionieren.

### Manuelle Methode (Alternative)

Falls Sie die einzelnen Schritte manuell ausführen möchten:

#### 1. Layer-Projekt global verlinken

In den Ordner des Nuxt-Layers wechseln und das Package global per Symlink verlinken:

```bash
cd /pfad/zu/madek-api-nuxt-layer
npm link && npm run dev
```

#### 2. Link im Hauptprojekt aktivieren

In das Hauptprojekt wechseln:

```bash
cd /pfad/zum/hauptprojekt
npm run madek-api-nuxt-layer:link && npm run dev
```

Jetzt wird der lokal verlinkte Nuxt-Layer (aus Schritt 1) anstelle der in der package.json angegebenen (veröffentlichten) Version verwendet.

**Wichtiger Hinweis:** Nuxt Plugins dürfen nicht doppelt installiert werden. Beispielsweise darf Pinia nur im Layer-Projekt installiert sein.

#### 3. Linking wieder auflösen (optional)

Wenn wieder die offizielle (z.B. auf npm oder Git referenzierte) Version verwenden werden soll:

- `npm install` im Hauptprojekt ausführen, dabei wird der Link automatisch aufgelöst und die Version aus der package.json verwendet

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
