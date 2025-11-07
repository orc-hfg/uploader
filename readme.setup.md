# Projekt-Setup

## Environment-Variablen konfigurieren

Das Projekt benötigt verschiedene Environment-Variablen für den korrekten Betrieb. Diese werden in einer `.env`-Datei im Projekt-Root konfiguriert.

### 1. `.env`-Dateien erstellen

#### Hauptkonfiguration: `.env`

- Die Datei `.env.example` als Vorlage verwenden
- Eine neue `.env`-Datei im Projekt-Root erstellen
- Die benötigten Werte entsprechend der folgenden Dokumentation eintragen
- Enthält alle Environment-Variablen: `GITHUB_PAT`, `NUXT_MADEK_API_TOKEN`, `MADEK_SSH_USER`, `SENTRY_AUTH_TOKEN`

**Hinweis:** Die Datei `.env` ist in `.gitignore` aufgeführt und wird nicht im Repository gespeichert, um sensible Daten privat zu halten.

#### Staging-spezifische Konfiguration: `.env.staging`

- Eine neue `.env.staging`-Datei im Projekt-Root erstellen
- Diese Datei enthält den `NUXT_MADEK_API_TOKEN` und `NUXT_PUBLIC_SERVER_URL` für das Staging-Environment
- Build-Zeit-Variablen (`GITHUB_PAT`, `MADEK_SSH_USER`) werden nicht benötigt
- Sentry ist nur im Development Mode aktiv, daher wird `SENTRY_AUTH_TOKEN` für Staging nicht benötigt

**Hinweis:** Die `.env.staging`-Datei ist ebenfalls in `.gitignore` aufgeführt.

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

#### GitHub Actions Secret konfigurieren (erforderlich für CI/CD)

Damit die GitHub Actions Workflows (CI/CD Pipeline) funktionieren, muss der GitHub PAT auch als Repository Secret hinterlegt werden:

1. Im GitHub Repository zu **Settings** → **Secrets and variables** → **Actions** navigieren
2. Unter **Repository secrets** auf **New repository secret** klicken
3. Als **Name** `GH_PAT` eingeben
4. Als **Secret** den gleichen Token-Wert wie in der `.env`-Datei eintragen
5. Mit **Add secret** speichern

**Hinweis:** Ohne dieses Secret schlagen die GitHub Actions Workflows fehl, da sie keinen Zugriff auf die @orc-hfg GitHub Packages haben.

#### NUXT_MADEK_API_TOKEN (erforderlich für Development und Staging)

**Zweck:** Token für den Zugriff auf die Madek API

**So erhältst du den Token:**
1. Im Madek-System anmelden:
   - **Development:** https://dev.madek.hfg-karlsruhe.de/my
   - **Staging:** https://staging.madek.hfg-karlsruhe.de/my
2. In linker Spalte den Menüpunkt Tokens öffnen
3. Einen neuen Token erstellen
4. Den Token in die entsprechende Datei eintragen:
   - **Für Development:** In die `.env`-Datei:
     ```
     NUXT_MADEK_API_TOKEN=your_madek_token_here
     ```
   - **Für Staging:** In die `.env.staging`-Datei:
     ```
     NUXT_MADEK_API_TOKEN=your_staging_madek_token_here
     ```

**Hinweis:** Für das Staging-Environment wird ein separater Token benötigt, der in der `.env.staging`-Datei gespeichert wird.

#### NUXT_PUBLIC_SERVER_URL (erforderlich für Staging Preview)

**Zweck:** Server-URL für Authentifizierungs-Endpunkte im Staging-Environment

**Erforderlich für:** Staging Preview-Server (`npm run build:preview:staging`)

**Konfiguration:**
```
NUXT_PUBLIC_SERVER_URL=https://staging.madek.hfg-karlsruhe.de/
```

**Wichtig:** Nur der Server-Teil der URL, **ohne** `/uploader/` am Ende. Die Authentifizierungs-Endpunkte laufen auf dem Staging-Server auf Root-Ebene, nicht unter dem App-Pfad.

**Hinweis:** Diese Variable wird nur für den Staging Preview-Server benötigt. Im normalen Development-Server (`npm run dev:staging`) wird sie nicht verwendet, da dort die Konfiguration aus `nuxt.config.ts` greift.

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

**Für Staging-Deployment:** Zusätzlich eine `.env.staging`-Datei mit dem Staging-spezifischen `NUXT_MADEK_API_TOKEN` und `NUXT_PUBLIC_SERVER_URL` erstellen.

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

### Beispiel einer `.env.staging`-Datei

```env
# Madek API Token für Staging (erforderlich)
NUXT_MADEK_API_TOKEN=your_staging_madek_token_here

# Server URL für Staging Preview (erforderlich für Preview-Server)
NUXT_PUBLIC_SERVER_URL=https://staging.madek.hfg-karlsruhe.de/
```

**Hinweis:** Die `.env.staging`-Datei enthält den Staging-spezifischen Madek API Token und die Server URL für den Preview-Server. Build-Zeit-Variablen (`GITHUB_PAT`, `MADEK_SSH_USER`) und Development-spezifische Variablen (`SENTRY_AUTH_TOKEN`) werden nicht benötigt.
