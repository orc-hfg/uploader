# Deployment

## Überblick

Das Deployment erfolgt manuell über npm-Skripte. Der GitHub Actions Workflow in diesem Projekt ist für Qualitätssicherung und Testing konzipiert, nicht für automatisches Deployment.

**Wichtig:** Release-Management (Versionierung mit Git-Tags) und Deployment sind getrennte Prozesse. Siehe [Release Management](./readme.release.md) für Informationen zur Versionierung.

## Deployment-Skripte

Für das manuelle Deployment stehen folgende npm-Skripte zur Verfügung:

```bash
# Deployment in die Entwicklungsumgebung
npm run deploy:development

# Deployment in die Staging-Umgebung
npm run deploy:staging
```

⚠️ **WICHTIG: Immer über npm-Skripte deployen!**

Deployments **müssen** über die npm-Skripte durchgeführt werden, da nur diese das automatische Deployment-Tracking gewährleisten. Manuelle Deployments (z.B. direkt mit rsync) umgehen das Logging und führen zu unvollständiger Deployment-Historie.

## Systemvoraussetzungen

Die Deployment-Skripte sind als **Bash-Scripts** implementiert und benötigen:

- **Bash Shell** (sh/bash)
- **SSH-Client** für Server-Zugriff
- **rsync** für Datei-Synchronisation
- **Git** für Repository-Operationen
- **jq** für JSON-Verarbeitung (Version-Checks)
- **curl** für Health-Endpoint-Abfragen (Version-Checks)

### Plattformspezifische Hinweise

**macOS:**
- ✅ Bash, SSH, rsync, Git, curl sind vorinstalliert
- ⚠️ jq muss installiert werden: `brew install jq`

**Linux:**
- ✅ Bash, SSH, rsync, Git, curl sind vorinstalliert
- ⚠️ jq eventuell nachinstallieren: `apt install jq` oder `yum install jq`

**Windows:**
- ⚠️ **WSL2 (Windows Subsystem for Linux) ist erforderlich**
- Nach WSL2-Installation: `sudo apt install jq`

## Deployment-Workflows

Das Deployment-System unterscheidet zwischen zwei Umgebungen mit unterschiedlichen Quality-Gates:

### 🚀 Development Deployment

**Verwendung**: Schnelle Iteration und Testing während der Entwicklung

**Quality-Checks**:

1. **Git-Status-Prüfung**
   - ⚠️ Warnung bei uncommitted changes (kann fortgesetzt werden)
   - ⚠️ Warnung bei unpushed commits (kann fortgesetzt werden)

2. **Version-Prüfung**
   - ⚠️ Warnung wenn Version unverändert (kann fortgesetzt werden)

3. **Build**
   - `npm ci` - Dependency Installation
   - `npm run build` - Application Build

4. **Deployment**
   - Deploy-Info generieren und zum Build hinzufügen
   - rsync Upload zum Server
   - Service Restart

**Philosophie**: Awareness ohne Blockierung für schnelle Entwicklungs-Iterationen

### 📦 Staging Deployment

**Verwendung**: Production-like Deployment für finale Tests

**Quality-Gates (PFLICHT)**:

1. **Git-Status-Prüfung**
   - ⚠️ Warnung bei uncommitted changes (kann fortgesetzt werden)
   - ⚠️ Warnung bei unpushed commits (kann fortgesetzt werden)

2. **Version-Increment (ZWINGEND)**
   - ❌ Version MUSS inkrementiert sein vs. letztem Deployment
   - ✅ Garantiert dass ein Release erstellt wurde
   - ❌ Bei fehlender Version: Deployment wird abgebrochen
   - 💡 Fehlermeldung zeigt Release-Befehle (`npm run release:patch/minor/major`)

3. **Build & E2E-Tests (ZWINGEND)**
   - 📦 Dependencies & Build: `npm ci` + `npm run build`
   - 🎭 E2E-Test-Suite mit Preview-Server (`npm run test:e2e:preview`)
   - ❌ Bei Build- oder Test-Fehlern: Deployment wird abgebrochen
   - ✅ Garantiert production-like Testing mit finalen Build-Artefakten
   - ℹ️ Environment-Variablen werden auf dem Server konfiguriert

4. **Deployment**
   - Deploy-Info generieren und zum Build hinzufügen
   - rsync Upload zum Server
   - Service Restart

**Philosophie**: Maximale Sicherheit - nur getesteter, versionierter Code

### Empfohlener Staging-Workflow

**Für sichere Staging-Deployments**:

```bash
# 1. Release erstellen (führt alle Quality-Checks aus)
npm run release:patch  # oder minor/major

# 2. Staging deployen (prüft Version + führt E2E-Tests aus)
npm run deploy:staging
```

**Detaillierter Ablauf**:

```bash
# Safe-Release führt aus:
npm run release:patch
  ├─ Branch-Check (nur main erlaubt)
  ├─ Working-Directory-Check (muss clean sein)
  ├─ Linting + Type-Checking + Unused-Code-Detection
  ├─ Unit-Tests
  ├─ Build
  ├─ E2E-Tests (preview mode)
  ├─ Version-Bump + Git-Tag
  └─ Push zu GitHub

# Staging-Deployment verifiziert:
npm run deploy:staging
  ├─ Git-Checks
  ├─ Version-Check ✅ (garantiert: Release wurde erstellt)
  ├─ npm ci + npm run build (Environment-Variablen vom Server)
  ├─ E2E-Tests mit Preview-Server ✅ (nutzt Build-Artefakte)
  └─ Deploy (rsync + Service Restart)
```

**Sicherheitsprinzip**: Staging-Deployments ohne vorherigen Release sind nicht möglich.

**Dies garantiert**:
- ✅ Alle Tests wurden ausgeführt (Linting, Type-Check, Unit-Tests, E2E-Tests via Release)
- ✅ Version wurde inkrementiert und git-tagged
- ✅ Code ist committed und zu GitHub gepusht
- ✅ Build wird einmal erstellt und für E2E-Tests + Deployment verwendet
- ✅ E2E-Tests validieren die exakten Build-Artefakte, die deployed werden
- ✅ Production-like Testing mit Preview-Server vor Deployment
- ✅ Keine nachträglichen Code-Änderungen nach Release möglich

## Version und Health Monitoring

Nach dem Deployment kannst du die deployed Version und den System-Status überprüfen:

### Deployment-Info abrufen

Empfohlen für schnelle Post-Deployment-Verifikation (formatierte, menschenlesbare Ausgabe):

```bash
# Deployment-Info vom Development-Server abrufen
npm run version:development

# Deployment-Info vom Staging-Server abrufen
npm run version:staging
```

**Output:**
```
Environment: development
Version:     0.2.7
Commit:      473ee56b5ffbf1a6f04b80ad0a33365f279ce22f
Branch:      main
Timestamp:   2025-10-27T17:49:54Z
User:        rzschoch
Package:     @orc-hfg/uploader@0.2.7
```

### Vollständiger Health-Check

Empfohlen für Monitoring-Systeme und JSON-Verarbeitung (enthält zusätzlich Server-Status):

```bash
# Health-Status vom Development-Server abrufen
npm run health:development

# Health-Status vom Staging-Server abrufen
npm run health:staging
```

**Output:**
```json
{
  "status": "healthy",
  "service": "uploader",
  "timestamp": "2025-10-28T13:07:45.599Z",
  "deploymentInfo": {
    "timestamp": "2025-10-27T17:49:54Z",
    "environment": "development",
    "version": "0.2.7",
    "commit": "473ee56b5ffbf1a6f04b80ad0a33365f279ce22f",
    "branch": "main",
    "user": "rzschoch",
    "package": "@orc-hfg/uploader@0.2.7"
  }
}
```

**Hinweis**: Die Deployment-Info ist nur auf deployed Servern verfügbar, nicht in der lokalen Entwicklungsumgebung.

## Deployment-Tracking

Jedes Deployment wird automatisch protokolliert, um Nachvollziehbarkeit zu gewährleisten.

### Automatische Protokollierung

Bei jedem Deployment wird folgendes dokumentiert:

- **Zeitstempel**: Wann wurde deployed?
- **Version**: Welche Version wurde deployed? (aus package.json)
- **Git-Commit**: Exakter Commit-Hash
- **Branch**: Von welchem Branch wurde deployed?
- **User**: Wer hat deployed?
- **Environment**: development oder staging

### Deployment-History abrufen

Die Deployment-History kann jederzeit abgerufen werden:

```bash
# Letzte 10 Deployments für development anzeigen
npm run deploy:history development

# Letzte 20 Deployments für staging anzeigen
npm run deploy:history staging 20

# Alle Deployments anzeigen
npm run deploy:history development all
```

### Deployment-Daten Architektur

Das System verwendet zwei komplementäre Dateien für unterschiedliche Zugriffsmuster:

#### 1. Öffentlich: `deploy-info.json` (HTTP)
- **Zugriff**: Via `/health` Endpoint (kein SSH erforderlich)
- **Inhalt**: Aktuelles Deployment
- **Verwendung**:
  - Schnelle Version-Checks (`npm run version:development`)
  - Monitoring-Systeme
  - Post-Deployment-Verifikation
  - Automatischer Version-Vergleich im Deployment-Skript
- **Vorteil**: Schneller Zugriff ohne Credentials

#### 2. Intern: `deploy-history.jsonl` (SSH)
- **Zugriff**: Via SSH (erfordert Authentifizierung)
- **Inhalt**: Vollständige Deployment-Historie (JSONL-Format)
- **Verwendung**:
  - Deployment-History (`npm run deploy:history`)
  - Audit-Trail
  - Rollback-Entscheidungen
- **Vorteil**: Geschützte, vollständige Historie

**Speicherorte auf dem Server**:
- `deploy-info.json`: `/srv/{env}/uploader/.output/public/deploy-info.json` (Teil des Builds)
- `deploy-history.jsonl`: `/srv/{env}/uploader/deploy-history.jsonl` (External log)

**Design-Prinzip**: *Security by Design* – Öffentlich nur das Nötigste (aktuelle Version), sensible History-Daten geschützt durch SSH-Authentifizierung.

**Technische Gründe für die Trennung**:
1. **Self-contained Build**: `deploy-info.json` ist Teil des Build-Outputs und wird mit deployed – der Build bringt seine Deployment-Info mit
2. **Atomic Deployment**: Deployment-Info gehört fest zum Build-Artefakt
3. **Performance**: HTTP-Endpoint liest kleine, einzelne Datei (schnell) statt gesamter History
4. **Sicherheit**: HTTP-Endpoint bleibt im Build-Directory, kein Zugriff auf Parent-Directories nötig
5. **Unabhängigkeit**: Build funktioniert auch, wenn History-Datei fehlt oder gelöscht wird

**Hinweis**: Alle Zeitstempel sind in UTC (ISO 8601 Format) für Konsistenz und plattformübergreifende Kompatibilität.

### Vorteile des Deployment-Trackings

1. **Nachvollziehbarkeit**: Jederzeit wissen, welche Version auf welchem Server läuft
2. **Team-Transparenz**: Alle Deployer sehen alle Deployments
3. **Debugging**: Bei Problemen schnell den exakten deployed Stand identifizieren
4. **Automatische Version-Prüfung**: Deployment-Skript nutzt deploy-info.json für Version-Vergleich

## GitHub Actions Workflow

Der GitHub Actions Workflow führt bei jedem Push folgende Schritte aus:

1. Code-Qualitätsprüfungen (Linting, Type-Checking, Erkennung ungenutzten Codes)
2. Unit-Tests
3. E2E-Tests mit Playwright
4. Build-Verifizierung

**Wichtig:** Der GitHub Actions Workflow führt **kein automatisches Deployment** durch. Deployment erfolgt manuell über die npm-Skripte nach erfolgreichem Release.
