# Projekt-Setup

## Environment-Variablen konfigurieren

Das Projekt benötigt verschiedene Environment-Variablen für den korrekten Betrieb. Diese werden in einer `.env`-Datei im Projekt-Root konfiguriert.

### 1. `.env`-Datei erstellen

- Die Datei `.env.example` als Vorlage verwenden
- Eine neue `.env`-Datei im Projekt-Root erstellen
- Die benötigten Werte entsprechend der folgenden Dokumentation eintragen

**Hinweis:** Die Datei `.env` ist in `.gitignore` aufgeführt und wird nicht im Repository gespeichert, um sensible Daten privat zu halten.

### 2. Benötigte Environment-Variablen

#### GITHUB_PAT (erforderlich)

**Zweck:** Zugriff auf @orc-hfg GitHub Packages (z.B. @orc-hfg/madek-api-nuxt-layer)

**Berechtigung:** `read:packages`

**So erhältst du den Token:**
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) öffnen
2. Einen neuen Token mit der Berechtigung `read:packages` erstellen
3. Den Token kopieren und in die `.env`-Datei eintragen:
   ```
   GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. `npm run setup-npmrc` ausführen, um die `.npmrc`-Datei zu erstellen
5. Anschließend `npm install` ausführen, um die Packages zu installieren

**Hinweis:** Die Datei `.npmrc` ist ebenfalls in `.gitignore` aufgeführt.

#### NUXT_MADEK_API_TOKEN (erforderlich für Development)

**Zweck:** Token für den Zugriff auf die Madek API im Development-Modus

**So erhältst du den Token:**
1. Im Madek-System anmelden: https://dev.madek.hfg-karlsruhe.de/my
2. In linker Spalte den Menüpunkt Tokens öffnen
3. Einen neuen Token erstellen
4. Den Token kopieren und in die `.env`-Datei eintragen:
   ```
   NUXT_MADEK_API_TOKEN=your_madek_token_here
   ```

**Hinweis:** Dieser Token wird für die lokale Entwicklung benötigt, um auf die Madek API zuzugreifen.

#### MADEK_SSH_USER (optional)

**Zweck:** SSH-Benutzername für Deployment auf den Madek-Server

**Erforderlich für:** Deployment-Skripte (`npm run deploy:development`, `npm run deploy:staging`)

**Konfiguration:**
```
MADEK_SSH_USER=your_ssh_username
```

**Hinweis:** Nur erforderlich, wenn du Deployment-Berechtigungen hast und die Anwendung auf den Server deployen möchtest.

#### SENTRY_AUTH_TOKEN (optional)

**Zweck:** Authentifizierung für das Sentry Build Plugin beim Upload von Source Maps

**Erforderlich für:** Production Builds mit Sentry-Integration

**So erhältst du den Token:**
1. Anleitung: [Sentry Auth Tokens](https://docs.sentry.io/account/auth-tokens/#organization-tokens)
2. Den Token kopieren und in die `.env`-Datei eintragen:
   ```
   SENTRY_AUTH_TOKEN=your_sentry_token_here
   ```

**Hinweis:** Für die lokale Entwicklung nicht erforderlich. Wird für Production bzw. Preview Builds verwendet.

### 3. Installation abschließen

Nachdem die `.env`-Datei korrekt konfiguriert wurde:

1. `npm run setup-npmrc` ausführen (generiert `.npmrc` aus `GITHUB_PAT`)
2. `npm install` ausführen (installiert alle Dependencies)
3. `npm run dev` ausführen (startet den Development-Server)

### Beispiel einer vollständigen `.env`-Datei

```env
# GitHub Personal Access Token (erforderlich)
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Madek API Token für Development (erforderlich)
NUXT_MADEK_API_TOKEN=your_madek_token_here

# SSH User für Deployment (optional)
MADEK_SSH_USER=your_ssh_username

# Sentry Auth Token für Production Builds (optional)
SENTRY_AUTH_TOKEN=your_sentry_token_here
```
