# Sentry Error Tracking

Sentry ist ein Error-Tracking-System, das Fehler und Performance-Probleme sowohl auf dem Client als auch auf dem Server überwacht.

## Übersicht

Sentry ist standardmäßig **deaktiviert** und muss explizit aktiviert werden. Die Integration umfasst:

- **Client- und Server-seitige Fehlerüberwachung**
- **Hostname-basierte Filterung** – nur Fehler vom konfigurierten Server werden gesendet
- **Datenscrubbing** – automatisches Filtern sensibler Daten (Server-seitig)
- **Source Map Upload** – lesbare Stack Traces in Produktion
- **Session Replay** – Aufzeichnung von User-Sessions bei Fehler (sollte ggf. deaktiviert werden, wenn Sentry in Produktionsumgebung verwendet wird)
- **Test-Seite** – zur Überprüfung der Funktionalität

## Projektdateien

### Konfigurationsdateien

#### `sentry.client.config.ts`
- Initialisiert Sentry für die Client-Seite (Browser)
- Hostname-Check **vor** Initialisierung
- Konfiguriert Tracing, Error-Capture und Session Replay
- Integriert Pinia State Management

#### `sentry.server.config.ts`
- Initialisiert Sentry für die Server-Seite (Nitro)
- Hostname-Check **im** `beforeSend` Hook
- Implementiert Datenscrubbing sensibler Informationen

### Test-Dateien

#### `app/pages/sentry-example-page.vue`
- Erreichbar unter: `http://localhost:3000/uploader/sentry-example-page`
- Testet Frontend- und Backend-Fehler
- Kann nach erfolgreichem Test gelöscht werden

#### `server/api/sentry-example-api.ts`
- Test-API-Route für Server-seitige Fehler
- Kann zusammen mit der Beispielseite gelöscht werden

## Setup & Konfiguration

### Schritt 1: Nuxt-Konfiguration anpassen

In `nuxt.config.ts` folgende Werte an den eigenen Sentry-Account anpassen:

**1. DSN (Data Source Name):**
- Dokumentation: https://docs.sentry.io/platforms/javascript/#configure
- Einfügen in: `runtimeConfig.public.sentry.dsn`

**2. Organisation und Projekt:**
- Dokumentation: https://docs.sentry.io/platforms/javascript/guides/nuxt/manual-setup/#step-3-add-readable-stack-traces-with-source-maps-optional
- Einfügen in: `sentry.sourceMapsUploadOptions`

**3. Allowed Hostname:**
- Hostname des Entwicklungs- oder Produktionsservers
- Beispiele: `'dev.example.com'` oder `'production.example.com'`
- Einfügen in: `runtimeConfig.public.sentry.allowHostname`

### Schritt 2: Environment-Variablen einrichten

**1. Auth Token generieren:**
- Anleitung: [Sentry Auth Tokens](https://docs.sentry.io/account/auth-tokens/)
- Benötigte Permissions: Source Maps Upload

**2. `.env` Datei erstellen/erweitern:**
```bash
# .env (nicht in Git committen!)
SENTRY_AUTH_TOKEN=your_token_here
```

**3. Sentry aktivieren:**
```bash
# In .env hinzufügen:
NUXT_PUBLIC_SENTRY_ENABLED=true
```

## Verwendung

### Sentry aktivieren

**Produktion:**
```bash
# Server Environment-Variablen setzen:
NUXT_PUBLIC_SENTRY_ENABLED=true
NUXT_PUBLIC_ENABLE_LOGGING=true  # optional
```

### Fehler testen

**Test-Seite öffnen:**
```
http://localhost:3000/uploader/sentry-example-page
```

**Test durchführen:**
1. "Throw Sample Error" Button klicken
2. Fehler in Sentry überprüfen: https://sentry.io/issues

**Erwartetes Verhalten:**
- Connectivity-Check erzeugt 400 Bad Request (normal)
- Frontend- und Backend-Fehler werden erfasst
- Sensible Daten sind gefiltert
- Source Maps sind verfügbar (im Preview/Production-Modus)

### Preview-Modus (lokales Testen mit Production-Build)

**Vorkonfigurierte Datei `.env.preview.sentry`:**
```bash
NUXT_PUBLIC_SENTRY_ENABLED=true
NUXT_PUBLIC_SENTRY_ALLOW_HOSTNAME=localhost
# ... weitere Konfigurationen
```

**NPM Scripts:**

**`npm run build:preview:sentry`**
- Erstellt Production-Build und startet Preview mit Sentry
- Verwendet `.env.preview.sentry` Konfiguration

**`npm run preview:sentry`**
- Startet nur Preview-Server (Build muss bereits existieren)
- Nützlich für schnelle Tests nach Config-Änderungen

## Technische Details

### 1. Datenscrubbing (Sensible Daten filtern)

**Nur Server-Seite**: Die Sentry-Server-Konfiguration implementiert Datenscrubbing über den `beforeSend` Hook.

**Wichtig**: Die Client-Konfiguration hat **kein** Datenscrubbing implementiert, wobei Sentry auch automatisch sensible Daten filtert.

**Gefilterte Daten (nur Server):**
- **Session-Cookie** (`madek-session`) – wird ersetzt durch `'[Filtered (sentry.server.config.ts)]'`
- **Query-Parameter** `responsible_user_id` – wird ersetzt durch `'[Filtered (sentry.server.config.ts)]'`

**NICHT gefiltert:**
- Authorization-Header (werden unverändert an Sentry gesendet) aber automatisch durch Sentry gefiltert
- Andere Cookies außer Session-Cookie
- Andere Query-Parameter außer `responsible_user_id`

**Funktionsweise (Server-Seite):**
Der `beforeSend` Hook ersetzt sensible Werte, anstatt sie zu löschen:

```typescript
// Replace sensitive cookies with placeholder
if (event.request.cookies) {
  for (const key of SENSITIVE_COOKIES) {
    if (typeof key === 'string' && key in event.request.cookies) {
      event.request.cookies[key] = '[Filtered (sentry.server.config.ts)]';
    }
  }
}

// Replace sensitive query parameters with placeholder
if (SENSITIVE_PARAMETERS.has(key)) {
  searchParameters.set(key, '[Filtered (sentry.server.config.ts)]');
}
```

**Vorteil dieser Methode**: Durch Ersetzen statt Löschen bleibt sichtbar, dass sensible Daten vorhanden waren, ohne die tatsächlichen Werte preiszugeben.

### 2. Hostname-basierte Filterung

Beide Konfigurationen filtern nach Hostname, aber unterschiedlich:

**Client-Seite** (`sentry.client.config.ts`):
```typescript
const isHostAllowed = location.hostname === sentry.allowHostname;

if (sentry.enabled === true && isHostAllowed) {
  Sentry.init({ /* ... */ });
}
```
- Prüfung **vor** Initialisierung
- Sentry wird auf falschen Hosts gar nicht erst gestartet
- Verwendet Browser-API `location.hostname`

**Server-Seite** (`sentry.server.config.ts`):
```typescript
function extractHostname(raw: string | undefined): string {
  // Extrahiert Hostname aus verschiedenen Formaten
  // Beispiel: 'dev.madek.hfg-karlsruhe.de:3000' → 'dev.madek.hfg-karlsruhe.de'
  const url = raw.includes('://') ? raw : `http://${raw}`;
  return new URL(url).hostname.toLocaleLowerCase();
}

const isHostAllowed = extractHostname(event.request?.headers?.host) === sentry.allowHostname;
if (!isHostAllowed) {
  return null; // Event wird nicht gesendet
}
```
- Prüfung **im** `beforeSend` Hook
- Sentry wird initialisiert, aber Events werden gefiltert
- Parst Hostname aus Request-Header

**Vorteil:** Verhindert, dass lokale Entwicklungsfehler (localhost) an Sentry gesendet werden.

### 3. Source Maps

Source Maps ermöglichen lesbare Stack Traces in Sentry:

- **Lokal:** Source Maps werden generiert (`sourcemap.client: 'hidden'`)
- **CI:** Client-Source-Maps deaktiviert (verhindert Buffer-Overflow bei E2E-Tests)
- **Produktion:** Source Maps werden automatisch hochgeladen via Sentry Build Plugin

**Konfiguration:** `sourceMapsUploadOptions` in nuxt.config.ts


## Weiterführende Dokumentation

- [Sentry Nuxt Dokumentation](https://docs.sentry.io/platforms/javascript/guides/nuxt/)
- [Sentry Configuration Options](https://docs.sentry.io/platforms/javascript/configuration/options/)
- [Source Maps Upload](https://docs.sentry.io/platforms/javascript/sourcemaps/)
- [Before Send Hook](https://docs.sentry.io/platforms/javascript/configuration/filtering/#using-beforesend)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)
