# Release Management

## Überblick: Git-Tags vs. GitHub Releases

**Wichtig zu verstehen:** In diesem Projekt (Uploader) erstellen die Release-Skripte **Git-Tags**, aber **keine GitHub Releases** (wie im dazugehörigen Nuxt-Layer-Projekt).

### Was wird automatisch erstellt?

✅ **Git-Tags** (über `npm run release:*`)
- Versionsnummer in package.json wird erhöht
- Git-Commit wird erstellt
- Git-Tag wird erstellt und gepusht
- Versionierung im Repository ist sichtbar

❌ **Keine GitHub Releases**
- Keine automatische Release-Erstellung in GitHub
- Kein Package Publishing
- Keine automatischen Release Notes

### Unterschied zum Nuxt-Layer-Projekt (https://github.com/orc-hfg/madek-api-nuxt-layer)

Im **Nuxt-Layer**-Projekt sieht der Prozess anders aus:
- Git-Tags triggern automatisch GitHub Actions
- GitHub Releases werden automatisch erstellt
- Package wird zu GitHub Packages publiziert
- Release Notes werden generiert

**Warum dieser Unterschied?**
- **Nuxt-Layer**: Wird als Package konsumiert → braucht Distribution-Mechanismus
- **Uploader**: Interne Anwendung → Git-Tags sind ausreichend für Versionierung

### Optionale manuelle GitHub Releases

GitHub Releases können bei Bedarf manuell erstellt werden (siehe Abschnitt weiter unten), sind aber nicht Teil des Standard-Workflows.

---

## Semantische Versionierung

Das Projekt verwendet semantische Versionierung und bietet sichere Skripte für die automatisierte Erstellung von Git-Tags.

## Release-Skripte

Für die Erstellung von versionierten Git-Tags stehen folgende npm-Skripte zur Verfügung:

```bash
# Patch-Release (1.0.0 -> 1.0.1): Bugfixes und kleine Änderungen
npm run release:patch

# Minor-Release (1.0.0 -> 1.1.0): Neue Features, die abwärtskompatibel sind
npm run release:minor

# Major-Release (1.0.0 -> 2.0.0): Breaking Changes
npm run release:major
```

### Was passiert bei `npm run release:*`?

Diese Skripte führen automatisch folgende Aktionen aus:

1. ✅ **Pre-Flight Checks**: Branch-Prüfung, Working Directory Check, Git Pull
2. ✅ **Lokale Quality Assurance Tests**: Komplette Test-Suite läuft lokal (~4 Minuten)
   - Linting (ESLint)
   - Type Checking (TypeScript)
   - Unused Code Detection (Knip)
   - Unit Tests (Vitest)
   - E2E Tests (Playwright)
3. ✅ **Version erhöhen**: Versionsnummer in package.json wird inkrementiert
4. ✅ **Git-Commit**: Commit mit Nachricht `chore: release X.X.X` wird erstellt
5. ✅ **Git-Tag**: Tag mit neuer Versionsnummer wird erstellt
6. ✅ **Push**: Commit und Tag werden zum Remote-Repository gepusht
7. ⚡ **GitHub Actions**: Workflow läuft, aber überspringt Tests (bereits lokal durchgeführt)

### Warum lokale Tests vor dem Push?

**Sicherheit**: Die lokalen Tests stellen sicher, dass kein ungetesteter Code in den main Branch gepusht wird:
- ❌ Wenn Tests fehlschlagen → Kein Push, kein Tag, keine Änderung
- ✅ Wenn Tests erfolgreich → Release wird erstellt und gepusht

**Effizienz**: CI-Tests werden bei Release-Commits übersprungen, weil sie bereits lokal liefen:
- Lokale Tests: ~4 Minuten (VOR dem Push)
- CI bei Release: ~30 Sekunden (nur Commit-Erkennung)
- Normale Commits/PRs: ~4 Minuten (volle CI-Test-Suite)

### Was passiert NICHT?

❌ **Keine GitHub Release-Erstellung**: Kein automatischer GitHub Release
❌ **Kein Package Publishing**: Kein Upload zu Package Registry

## Berechtigungen und Branch-Protection

**Wichtig:** Der main-Branch ist durch Branch-Protection-Regeln geschützt:

- **Repository Admins** können Releases direkt vom main Branch erstellen (Bypass-Berechtigung)
- **Andere Contributors** benötigen Admin-Rechte oder müssen zur Bypass-Liste hinzugefügt werden
- Bei fehlenden Berechtigungen schlägt `npm run release:*` mit einem Branch Protection Fehler fehl

**Für neue Team-Mitglieder**: Falls Release-Erstellung fehlschlägt, kontaktiere einen Repository Admin zur Berechtigung.

## Release-Strategie

- **Nicht jeder PR = Release**: Zusammengehörige Änderungen sammeln
- **Batch-Releases**: Mehrere kleine Änderungen in einem Release
- **Bewusste Entscheidungen**: Überlegen, ob der aktuelle Stand deployment-ready ist

## Optionale GitHub Releases (manuell)

**Hinweis:** GitHub Releases sind für dieses Projekt optional und nicht Teil des Standard-Workflows.

Falls du trotzdem einen GitHub Release erstellen möchtest (z.B. für bessere Sichtbarkeit oder Release Notes), kannst du dies manuell tun:

1. **Release-Sektion aufrufen**
   Gehe im Repository in den Abschnitt **„Releases"**.

2. **Neues Release erstellen**
   Klicke auf **„Draft a new release"**

3. **Tag auswählen**
   Wähle den vorher erstellten Git-Tag (z.B. `v1.1.0`) aus der Dropdown-Liste aus.

4. **Release Details**
   Gib einen Titel (z.B. `1.1.0`) ein und ergänze bei Bedarf Release Notes.

5. **Veröffentlichen**
   Klicke auf **„Publish release"**.

**Wichtig:** Dies ist ein rein optionaler Schritt für bessere Dokumentation. Die Versionierung funktioniert auch ohne GitHub Releases über Git-Tags.

## Deployment

Der GitHub Actions Workflow in diesem Projekt ist für Qualitätssicherung und Testing konzipiert, nicht für Deployment. Die CI-Pipeline führt folgende Schritte aus:

1. Code-Qualitätsprüfungen (Linting, Type-Checking, Erkennung ungenutzten Codes)
2. Unit-Tests
3. E2E-Tests mit Playwright
4. Build-Verifizierung

### Systemvoraussetzungen für Deployment

Die Deployment-Skripte sind als **Bash-Scripts** implementiert und benötigen:

- **Bash Shell** (sh/bash)
- **SSH-Client** für Server-Zugriff
- **rsync** für Datei-Synchronisation
- **Git** für Repository-Operationen

#### Plattformspezifische Hinweise

**macOS / Linux:**
✅ Alle Tools sind standardmäßig verfügbar

**Windows:**
⚠️ **WSL2 (Windows Subsystem for Linux) ist erforderlich**

### Deployment-Skripte

Für das manuelle Deployment stehen separate Skripte zur Verfügung:

```bash
# Deployment in die Entwicklungsumgebung
npm run deploy:development

# Deployment in die Staging-Umgebung
npm run deploy:staging
```

### Was passiert beim Deployment?

Das Deployment-Skript führt folgende Schritte aus:

1. Überprüfung der erforderlichen Umgebungsvariablen
2. Bereinigung und Installation der Abhängigkeiten (`npm ci`)
3. Build der Anwendung (`npm run build`)
4. Übertragung der Build-Artefakte auf den entsprechenden Server via rsync
5. Neustart des jeweiligen Services auf dem Server

**Wichtige Hinweise:**

- Deployments sollten nur von getesteten Code-Ständen durchgeführt werden
- Alle CI/CD-Tests müssen erfolgreich durchgelaufen sein

### Deployment-Tracking

Jedes Deployment wird automatisch protokolliert, um Nachvollziehbarkeit zu gewährleisten:

#### Automatische Protokollierung

Bei jedem Deployment wird folgendes dokumentiert:

- **Zeitstempel**: Wann wurde deployed?
- **Version**: Welche Version wurde deployed? (aus package.json)
- **Git-Commit**: Exakter Commit-Hash
- **Branch**: Von welchem Branch wurde deployed?
- **User**: Wer hat deployed?
- **Environment**: development oder staging

#### Deployment-History abrufen

Die Deployment-History kann jederzeit abgerufen werden:

```bash
# Letzte 10 Deployments für development anzeigen
npm run deploy:history development

# Letzte 20 Deployments für staging anzeigen
npm run deploy:history staging 20

# Alle Deployments anzeigen
npm run deploy:history development all
```

#### Deployment-Info auf dem Server

Die aktuelle Deployment-Version ist über den Health-Endpoint verfügbar:

```bash
# Development
curl https://dev.madek.hfg-karlsruhe.de/uploader/health

# Staging
curl https://staging.madek.hfg-karlsruhe.de/uploader/health
```

Response enthält Deployment-Informationen:
```json
{
  "status": "healthy",
  "service": "uploader",
  "timestamp": "2025-01-24T14:30:00.000Z",
  "deploymentInfo": {
    "timestamp": "2025-01-24T14:25:00Z",
    "environment": "development",
    "version": "0.2.4",
    "commit": "abc123def456...",
    "branch": "main",
    "user": "rzschoch",
    "package": "@orc-hfg/uploader@0.2.4"
  }
}
```

**Hinweis**: Die Deployment-Info ist nur auf deployed Servern verfügbar, nicht in der lokalen Entwicklungsumgebung.

#### Wo werden die Logs gespeichert?

- **Server-seitig**: `/srv/{env}/uploader/deploy-history.jsonl` (JSONL-Format)
- **Lokal**: Keine lokalen Logs (Team-Transparenz: Alle sehen alle Deployments)

#### Vorteile des Deployment-Trackings

1. **Nachvollziehbarkeit**: Jederzeit wissen, welche Version auf welchem Server läuft
2. **Team-Transparenz**: Alle Deployer sehen alle Deployments
3. **Debugging**: Bei Problemen schnell den exakten deployed Stand identifizieren

## Warum Git-Tags statt automatisierte GitHub Releases?

Dieses Projekt nutzt **Git-Tags für Versionierung**, aber **keine automatischen GitHub Releases**. Die Gründe hierfür sind:

### Git-Tags sind ausreichend für dieses Projekt

1. **Versionierung**: Git-Tags erfüllen alle Anforderungen für Versionsnachverfolgung
2. **Einfachheit**: Keine zusätzlichen GitHub Actions oder Workflows erforderlich
3. **Integration**: npm-Release-Skripte funktionieren direkt mit Git
4. **Sichtbarkeit**: Versionen sind in Git-History und package.json klar erkennbar

### GitHub Releases wären Overhead

1. **Kein Package Publishing**: Die Anwendung wird nicht als Package konsumiert
2. **Deployment ist unabhängig**: Deployment erfolgt manuell über separate Skripte
3. **Keine externe Distribution**: Keine Release Notes für externe Konsumenten erforderlich

### Vergleich mit dem Nuxt-Layer-Projekt

Im **Nuxt-Layer-Projekt** sind automatische GitHub Releases notwendig, weil:
- Das Package zu GitHub Packages publiziert wird
- Externe Projekte (wie dieser Uploader) das Package konsumieren
- Release Notes für Konsumenten wichtig sind
- Versionskommunikation nach außen erforderlich ist

Im **Uploader** sind Git-Tags ausreichend, weil:
- Nur interne Nutzung
- Deployment ist manuell und unabhängig von Versionen
- Versionierung dient nur der internen Organisation

### Fazit

Git-Tags bieten für dieses Projekt eine gute Balance zwischen Einfachheit und Funktionalität. GitHub Releases können bei Bedarf manuell erstellt werden (siehe vorheriger Abschnitt), sind aber nicht Teil des Standard-Workflows.
