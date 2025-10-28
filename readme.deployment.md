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

## Was passiert beim Deployment?

Das Deployment-Skript führt folgende Schritte aus:

1. Überprüfung der erforderlichen Umgebungsvariablen
2. Bereinigung und Installation der Abhängigkeiten (`npm ci`)
3. Build der Anwendung (`npm run build`)
4. Übertragung der Build-Artefakte auf den entsprechenden Server via rsync
5. Neustart des jeweiligen Services auf dem Server

**Wichtige Hinweise:**

- Deployments sollten nur von getesteten Code-Ständen durchgeführt werden
- Alle CI/CD-Tests müssen erfolgreich durchgelaufen sein

## Systemvoraussetzungen

Die Deployment-Skripte sind als **Bash-Scripts** implementiert und benötigen:

- **Bash Shell** (sh/bash)
- **SSH-Client** für Server-Zugriff
- **rsync** für Datei-Synchronisation
- **Git** für Repository-Operationen

### Plattformspezifische Hinweise

**macOS / Linux:**
✅ Alle Tools sind standardmäßig verfügbar

**Windows:**
⚠️ **WSL2 (Windows Subsystem for Linux) ist erforderlich**

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

### Wo werden die Logs gespeichert?

- **Server-seitig**: `/srv/{env}/uploader/deploy-history.jsonl` (JSONL-Format)
- **Lokal**: Keine lokalen Logs (Team-Transparenz: Alle sehen alle Deployments)

### Vorteile des Deployment-Trackings

1. **Nachvollziehbarkeit**: Jederzeit wissen, welche Version auf welchem Server läuft
2. **Team-Transparenz**: Alle Deployer sehen alle Deployments
3. **Debugging**: Bei Problemen schnell den exakten deployed Stand identifizieren

## CI/CD Pipeline

Der GitHub Actions Workflow führt bei jedem Push folgende Schritte aus:

1. Code-Qualitätsprüfungen (Linting, Type-Checking, Erkennung ungenutzten Codes)
2. Unit-Tests
3. E2E-Tests mit Playwright
4. Build-Verifizierung

**Wichtig:** Der CI/CD Workflow führt kein automatisches Deployment durch. Deployment erfolgt manuell über die npm-Skripte.
