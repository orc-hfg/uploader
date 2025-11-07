# Authentifizierung

## Authentifizierungsstrategien nach Umgebung

### Entwicklungsumgebung (`npm run dev`)

**Strategie**: Token-basierte Authentifizierung mit Mock
- **Authentifizierungs-Mock**: Aktiv - Stellt Sign-in-Endpoints zur Verfügung
- **Auth-Info-Mock**: Inaktiv - **Nicht benötigt** bei Token-basierter Authentifizierung
- **Zweck**: Lokale Entwicklung ohne externen Authentifizierungsserver

**Ablauf**:
1. Sign-in-Formular nutzt gemockte Sign-in-Endpoints
2. **Direkter API-Zugriff**: Token im Header ermöglicht alle API-Aufrufe ohne Session-Validierung

### Preview/CI-Umgebung (`npm run preview`)

**Strategie**: Session-basierte Authentifizierung mit vollständigem Mock
- **Authentifizierungs-Mock**: Aktiv - Stellt Sign-in-Endpoints zur Verfügung
- **Auth-Info-Mock**: Aktiv - **Erforderlich** für Session-Validierung
- **Zweck**: E2E-Testing ohne externe Abhängigkeiten

**Ablauf**:
1. Sign-in-Formular nutzt gemockte Sign-in-Endpoints
2. Nach erfolgreichem Sign-in wird **Session-Cookie** gesetzt
3. **Session-Validierung**: Auth-Info-Endpoint validiert Session-Cookies für jeden nachfolgenden Request

## Test-Zugangsdaten für Authentication Mock

### Credentials

**Benutzername:** `test`
**Passwort:** `123`

### Wo sind sie definiert?

Die Test-Credentials sind zentral definiert in: **`shared/constants/test.ts`**

**Verwendung**:
- Lokale Entwicklung: Manuelles Sign-in über das Sign-in-Formular
- E2E-Tests: Automatisches Sign-in via `signInAsValidUser()` Helper
- Playwright Setup: Erstellt authentifizierte Session in `authentication.setup.ts`

### Wichtige Hinweise

⚠️ **Diese Credentials sind nur für Mock/Development**:
- Funktionieren **nur**, wenn `enableAuthenticationMock: true` in `nuxt.config.ts`
- Werden **nie** in Production verwendet
- Sind einfach gehalten für schnelle lokale Entwicklung

## URL-Strukturen und Umgebungsunterschiede

### Lokale Entwicklung vs. Produktion

**Produktion**:
- Authentifizierungssystem läuft auf Root-Pfad: `https://server/auth/auth-systems`
- Anwendung läuft auf: `https://server/uploader/`

**Lokale Entwicklung (mit Mock)**:
- Authentifizierungs-Mock läuft auf: `http://localhost:3000/uploader/auth/auth-systems`
- Anwendung läuft auf: `http://localhost:3000/uploader/`

**Wichtig**: Die Entwicklungsumgebung verwendet `/uploader/` als Basis-URL in allen Umgebungen (Entwicklung, Vorschau, Produktion), um eine konsistente Implementierung zu gewährleisten.

## Authentifizierungs-API-Struktur

**Sign-In URL-Struktur**: `/auth/auth-systems/password/password/sign-in`
- Die doppelte "password/password" Segment ist eine API-Anforderung, kein Designfehler
- Diese komplexe Struktur muss für die Kompatibilität mit dem externen Authentifizierungssystem beibehalten werden

**Andere Endpunkte**:
- Session-Initialisierung: `/auth/auth-systems/` mit Query-Parametern
- Sign-out: `/auth/sign-out`

## Middleware und Sicherheit

Die Authentifizierungsmiddleware verwendet eine sichere Implementierung mit Seiten-Level-Authentifizierungskontrolle:

- Seiten, die keine Authentifizierung benötigen: `definePageMeta({ skipAuthenticationCheck: true })`
- Middleware prüft: `to.meta.skipAuthenticationCheck === true`
- Vermeidet unsichere Substring-Matching-Methoden
